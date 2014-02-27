var FB = require('fb'),
    Step = require('step');

FB.options({
  appId:          process.env.FACEBOOK_APPID || "633324146737659",
  appSecret:      process.env.FACEBOOK_SECRET  || "bf135295b34333d56d5c41ea77328ffe",
  redirectUri:    process.env.FACEBOOK_REDIRECT_URI || "http://localhost:3000/callback"
});

exports.index = function(req, res) {
  var id = req.session.fb_id;
  if (id) return res.redirect('/events');
  res.render("index", {theme: req.session.theme});
}

exports.login = function(req, res) {
  var accessToken = req.session.access_token;
  if(!accessToken) {
    res.redirect(FB.getLoginUrl({ scope: 'email' }));
  } else {
    res.redirect('/');
  }
};

exports.loginCallback = function (req, res, next) {
  var code            = req.query.code;

  if(req.query.error) {
    // user might have disallowed the app
    return res.send('login-error ' + req.query.error_description);
  } else if(!code) {
    return res.redirect('/');
  }

  Step(
    function exchangeCodeForAccessToken() {
      FB.napi('oauth/access_token', {
        client_id:      FB.options('appId'),
        client_secret:  FB.options('appSecret'),
        redirect_uri:   FB.options('redirectUri'),
        code:           code
      }, this);
    },
    function extendAccessToken(err, result) {
      if(err) throw(err);
      FB.napi('oauth/access_token', {
        client_id:          FB.options('appId'),
        client_secret:      FB.options('appSecret'),
        grant_type:         'fb_exchange_token',
        fb_exchange_token:  result.access_token
      }, this);
    },
    function (err, result) {
      if(err) return next(err);

      req.session.access_token    = result.access_token;
      req.session.expires         = result.expires || 0;

      FB.setAccessToken(result.access_token);
      FB.api('/me', function(fb_result) {
        console.log("Querying me");
        if(!fb_result || fb_result.error) {
          console.log(!fb_result ? 'error occurred' : fb_result.error);
          return;
        }
        var User = req.app.get('models')('user');

        req.session.fb_id = fb_result.id;
        req.session.fb_name = fb_result.name;
        User.findOne({fb_id: fb_result.id}, function(error, record) {
          if (record === null || error) {
            console.log("Create a new user object");
            user = new User({
              fb_id:       fb_result.id,
              fb_name:     fb_result.name,
              firstUse:    true,
              firstDecide: true
            });
            user.save(function(error) {
              if (error) console.log(error);
              req.session.first_use = true;
              req.session.first_decide = true;
              return res.redirect('/');
            });
          } else {
            req.session.first_use = record.firstUse;
            req.session.first_decide = record.firstDecide;
            return res.redirect('/');
          }
        });
      });
    }
  );
};

exports.logout = function (req, res) {
  req.session.destroy(); // clear session
  res.redirect('/');
};

exports.theme = function (req, res) {
  req.session.theme = req.params.id;
  res.redirect('/');
}