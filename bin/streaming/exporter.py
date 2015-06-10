from pymongo import Connection, ASCENDING

from unicodecsv import UnicodeWriter

from settings import (
					  MONGO_URL, MONGO_DB, MONGO_SENTIMENT, MONGO_STOCK,
					  FILENAME, EXPORT_START, EXPORT_END,
					  COLUMNS
)


def create_connection(table):
	connection = Connection(MONGO_URL)
	db = connection[MONGO_DB]
	collection = db[table]

	return collection


def create_query():
	query = {'created_at' : {
							 '$gte' : EXPORT_START,
							 '$lt'	: EXPORT_END
							}
	}

	return query


def retrieve_data(collection, query):
	tweets = collection.find(query, sort=[('created_at', ASCENDING)])
	return tweets


def write_to_csv(prefix, tweets):
	out_csv = UnicodeWriter(open('%s%s' % (prefix, FILENAME), 'wb'), delimiter=',')
	out_csv.writerow(COLUMNS)
	for tweet in tweets:
		row = []
		for column in COLUMNS:
			if column in tweet:
				row.append(tweet[column])
		out_csv.writerow(row)
		

if __name__ == '__main__':
	for table in [MONGO_SENTIMENT, MONGO_STOCK]:
		collection = create_connection(table)
		query = create_query()
		data = retrieve_data(collection, query)
		write_to_csv(table, data)
