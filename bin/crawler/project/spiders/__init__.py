from scrapy.contrib.spiders import CrawlSpider

from project.items import ProjectItem, ProjectItemLoader


class ProjectSpider(CrawlSpider):

    def __init__(self, *a, **kw):
        super(ProjectSpider, self).__init__(*a, **kw)
        self.log("__init__ %s" % self.__class__.__name__)

    def item_loader(self, response):
        item = ProjectItemLoader(ProjectItem(), response=response)
        return item
