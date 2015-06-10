from datetime import datetime

from pymongo import Connection

from tweepy import API, OAuthHandler
from tweepy.streaming import Stream

from settings import (
                      CONSUMER_KEY, CONSUMER_SECRET, ACCESS_KEY, ACCESS_SECRET,
                      MONGO_URL, MONGO_DB,
                      MONGO_SENTIMENT, MONGO_STOCK, MONGO_ERROR,
                      STOCK_CODES
)
from tweetstream import TweetStreamListener


class Controller(object):
    db = None
    track = []

    def __init__(self):
        self.__handleOAuth()
        self.__mongo_connect()

        for code in STOCK_CODES.keys():
            self.track.append("$" + code)

        self.__listen()

    def __handleOAuth(self):
        self.auth = OAuthHandler(CONSUMER_KEY, CONSUMER_SECRET)
        self.auth.set_access_token(ACCESS_KEY, ACCESS_SECRET)
        self.api = API(self.auth)

    def __mongo_connect(self):
        if self.db == None:
            connection = Connection(MONGO_URL)
            self.db = connection[MONGO_DB]
            self.sentiment = self.db[MONGO_SENTIMENT]
            self.non_sentiment = self.db[MONGO_STOCK]
            self.error = self.db[MONGO_ERROR]

    def __listen(self):
        listener = TweetStreamListener(self.api,
                   self.sentiment, self.non_sentiment, self.error)
        stream = Stream(self.auth, listener)

        print 'Starting stream...'
        try:
            stream.filter(track=self.track)
        except:
            print 'Encountered error!'
            print 'Exiting application'
            item = {
                    'status'    : 'stream down',
                    'timestamp' : datetime.utcnow()
                   }
            self.error.save(item)
            stream.disconnect()


if __name__ == '__main__':
    control = Controller()
