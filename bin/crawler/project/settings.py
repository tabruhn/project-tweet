from rauth import OAuth1Service


BOT_NAME = 'projectCrawler'

SPIDER_MODULES = ['project.spiders']
NEWSPIDER_MODULE = 'project.spiders'

MONGO_URL = 'mongodb://localhost:27017'
MONGO_DB = 'projectTweet'
MONGO_TWITTER = 'twitter'
MONGO_YAHOO = 'yahoo'

HTTPCACHE_ENABLED = True
HTTPCACHE_EXPIRATION_SECS = 60 * 60 * 24
HTTPCACHE_DIR = "~/.scrapy_cache"

ITEM_PIPELINES = ['project.pipelines.MongoPipeline']

TWITTER = OAuth1Service(
    name = 'twitter',
    consumer_key = 'LiDFvemGvbCEN2KlifEPEQ',
    consumer_secret = 'OvimQpJwrWxbnU9HYOsP1RWnn6xRoFlsha6yMLkrk',
    request_token_url = 'https://api.twitter.com/oauth/request_token',
    access_token_url = 'https://api.twitter.com/oauth/access_token',
    authorize_url = 'https://api.twitter.com/oauth/authorize',
    base_url = 'https://api.twitter.com/1.1/'
)

STOCKS = ['AAPL']
