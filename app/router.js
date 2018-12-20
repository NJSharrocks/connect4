import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route("game", {path: "/"});
  this.route('highscores');
});

export default Router;
