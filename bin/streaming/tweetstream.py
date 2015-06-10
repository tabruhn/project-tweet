from datetime import datetime

from tweepy import StreamListener

from settings import BUY_SENTIMENT


class TweetStreamListener(StreamListener):

    def __init__(self, api, data_collection, extra_collection, error_collection):
        self.api = api
        self.counter = 0
        self.data = data_collection
        self.extra = extra_collection
        self.error = error_collection

    def on_status(self, status):
        text = status.text.lower()
        buy_sentiment = None
        sentiment_word = []
        for word, sentiment in BUY_SENTIMENT.iteritems():
            if word in text and not buy_sentiment:
                buy_sentiment = sentiment
                sentiment_word.append(word)

        stocks = self.__generate_list(status.entities['symbols'])
        hashtags = self.__generate_list(status.entities['hashtags'])
        user_mentions = self.__generate_list(status.entities['user_mentions'])

        item = {
                '_id'           : status.id,
                'screen_name'   : status.user.screen_name,
                'full_name'     : status.user.name,
                'location'      : status.user.location,
                'stock'         : stocks,
                'num_stock'     : len(stocks),
                'tweet'         : status.text,
                'favorited'     : status.favorite_count,
                'retweeted'     : status.retweet_count,
                'is_retweet'    : status.retweeted,
                'hashtags'      : hashtags,
                'user_mentions' : user_mentions,
                'geo'           : status.geo,
                'coordinates'   : status.coordinates,
                'created_at'    : status.created_at,
                'timestamp'     : datetime.utcnow()
        }
        

        if buy_sentiment != None:
            self.counter += 1
            item['buy_sentiment'] = buy_sentiment
            item['sentiment_word'] = sentiment_word
            
            print item
            self.data.save(item)
        else:
            self.extra.save(item)
        
        return True

    def on_error(self, status_code):
        item = {
                'status'    : status_code,
                'timestamp' : datetime.utcnow()
        }

        self.error.save(item)
        return True

    def on_timeout(self):
        item = {
                'status'    : 'timed out',
                'timestamp' : datetime.utcnow()
        }

        self.error.save(item)
        return True

    def __generate_list(self, values):
        list_item = []
        for value in values:
            if 'text' in value.keys():
                list_item.append(value['text'])
            elif 'screen_name' in value.keys():
                list_item.append(value['screen_name'])
        return list_item
