var request = require('sync-request');

class GitHubReactions {
  constructor (url) {
    this.gh_client = process.env['GH_CLIENT'];
    this.gh_secret = process.env['GH_SECRET'];

    this.url = 'https://api.github.com/repos/' + url + '/reactions?client_id=' + this.gh_client + '&client_secret=' + this.gh_secret;
  }

  get() {
    console.log(this.url);
    return request('GET', this.url, {
      headers: {
        "Accept": "application/vnd.github.squirrel-girl-preview",
        'User-Agent': 'Reactions Chart'
      }
    });
  }

  collectedReactions () {
    var reactions = {}

    this.reactions().forEach(function (reaction) {
      if (reactions.hasOwnProperty(reaction.content)) {
        reactions[reaction.content]++;
      } else {
        reactions[reaction.content] = 1;
      }
    });

    return reactions;
  }

  reactions () {
    return JSON.parse(this.get().getBody('utf8'));
  }
}

module.exports = GitHubReactions;
