from re import findall

from scrapy.conf import settings
from scrapy.http import FormRequest, Request
from scrapy.selector import HtmlXPathSelector

from project.spiders import ProjectSpider


def populate_item(item, tweet, count):
    item.add_value('_id', tweet['id'])

    item.add_value('screen_name', tweet['user']['screen_name'])
    item.add_value('full_name', tweet['user']['name'])
    item.add_value('location', tweet['user']['location'])
    if tweet['place']:
        item.add_value('location', tweet['place'])

    item.add_value('stock', tweet['entities']['symbols'][count]['text'])
    item.add_value('tweet', tweet['text'])
    item.add_value('favorited', tweet['favorite_count'])
    item.add_value('retweeted', tweet['retweet_count'])

    for value in tweet['entities']['user_mentions']:
        item.add_value('user_mentions', value['screen_name'])

    for value in tweet['entities']['hashtags']:
        item.add_value('hashtags', value['text'])

    item.add_value('created_at', tweet['created_at'])

    return item



class TwitterSpider(ProjectSpider):
    name = 'api.twitter.com'
    url = 'https://api.twitter.com/1.1/'
    allowed_domains = ['api.twitter.com']

    def start_requests(self):
        self.request_token, self.request_token_secret = settings['TWITTER'].get_request_token()
        url = settings['TWITTER'].get_authorize_url(self.request_token)

        yield Request(url, callback=self.parse_authentication)

    def parse_authentication(self, response):
        hxs = HtmlXPathSelector(response)

        oauth_token = findall(r'\?oauth_token=(\w+)', response.url)
        authenticity_token = hxs.select('//input[@name="authenticity_token"]/@value').extract()[0]
        input = {
                 'authenticity_token': authenticity_token,
                 'oauth_token': oauth_token,
                 'session[username_or_email]': 'BossmanNelson',
                 'session[password]': 'bossman_is_boss'
        }
        url = hxs.select('id("oauth_form")//@action').extract()[0]

        yield FormRequest(url, formdata=input, callback=self.parse_item)

    def parse_item(self, response):
        hxs = HtmlXPathSelector(response)
        pin = hxs.select('id("oauth_pin")/p//code/text()').extract()[0]

        session = settings['TWITTER'].get_auth_session(self.request_token,
                                                       self.request_token_secret,
                                                       method='POST',
                                                       data={'oauth_verifier': pin}
        )

        parameters = {
                      'count': 100,
        }
        for stock in settings['STOCKS']:
            parameters['q'] = '$%s' % stock
            data = session.get('search/tweets.json', params=parameters).json()['statuses']
        
            for tweet in data:
                for i in range(0, len(tweet['entities']['symbols'])):
                    item = self.item_loader(response)
                    yield populate_item(item, tweet, i).load_item()
