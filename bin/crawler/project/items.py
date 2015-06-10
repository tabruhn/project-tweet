from scrapy.item import Field, Item
from scrapy.contrib.loader import XPathItemLoader
from scrapy.contrib.loader.processor import MapCompose

from project.processor import (
    TakeFirst, normalize_string, cast_string, cast_int, cast_datetime
)


class ProjectItem(Item):
    _id = Field()
    
    screen_name = Field()
    full_name = Field()
    location = Field()

    stock = Field()
    tweet = Field()
    favorited = Field()
    retweeted = Field()

    user_mentions = Field()
    hashtags = Field()
    created_at = Field()


class ProjectItemLoader(XPathItemLoader):

    def __init__(self, *args, **kwargs):
        super(ProjectItemLoader,self).__init__(*args, **kwargs)

        self.default_input_processor = MapCompose(normalize_string)
        self.default_output_processor = TakeFirst()

        self._id_in = MapCompose(cast_string)

        self.favorited_in = MapCompose(cast_int)
        self.retweeted_in = MapCompose(cast_int)

        self.created_at_in = MapCompose(cast_datetime)
