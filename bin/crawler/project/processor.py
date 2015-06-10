from datetime import datetime, timedelta

from re import findall


def normalize_string(value, separator=u' '):
    if isinstance(value, basestring):
        value = unicode(value)
        return separator.join(value.split())
    else:
        return value

def cast_string(value):
    return str(value)

def cast_int(value):
    return int(value)

def cast_datetime(value, format='%a %b %d %H:%M:%S %Y'):
    offset = findall(r'([\+-]\d{4}\s)', value)
    if offset:
        value = ''.join(value.split(offset[0]))
    return datetime.strptime(value, format)


class TakeFirst(object):
    def __call__(self, values):
        for value in values:
            if value or isinstance(value, timedelta) \
                     or isinstance(value, bool) \
                     or isinstance(value, int) \
                     or isinstance(value, float):
                return value
