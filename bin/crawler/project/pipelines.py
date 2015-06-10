from datetime import datetime

from pymongo import Connection

from scrapy.conf import settings


class MongoPipeline(object):
    db = None
    mongo = None

    def __init__(self):
        if self.db == None:
            connection = Connection(settings.get('MONGO_URL'))
            self.db = connection[settings.get('MONGO_DB')]
            self.mongo = self.db[settings.get('MONGO_TWITTER')]
                
    def process_item(self, item, spider):
        item = dict(item)

        item['timestamp'] = datetime.utcnow()

        self.mongo.save(item)
        return item
