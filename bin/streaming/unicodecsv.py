import csv
import cStringIO
import codecs

class UnicodeWriter(object):

    def __init__(self, f, dialect=csv.excel, encoding='utf-8', **kwargs):
        self.queue = cStringIO.StringIO()
        self.writer = csv.writer(self.queue, dialect=dialect, **kwargs)
        self.stream = f
        self.encoder = codecs.getincrementalencoder(encoding)()

    def writerow(self, row):
        output = []
        for var in row:
            if isinstance(var, basestring):
                var = var.encode('utf-8')
            elif isinstance(var, list):
                var = [item.encode('utf-8') for item in var]
            output.append(var)

        self.writer.writerow(output)
        data = self.queue.getvalue()
        data = data.decode('utf-8')
        data = self.encoder.encode(data)
        self.stream.write(data)
        self.queue.truncate(0)

    def writerows(self, rows):
        for row in rows:
            self.writerow(row)
