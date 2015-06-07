# Querying Data
InfluxDB features an SQL-like query language for querying data and performing aggregations on that data. This section describes the syntax of the query. All queries that return data use the keyword `SELECT`.

The primary mechanism for issuing any of the queries listed below is through the HTTP API. For example, the command `SELECT * FROM cpu` can be executed using `curl` as follows:

```
curl -G 'http://localhost:8086/query' --data-urlencode "q=SELECT * FROM cpu"
```
## Quote Usage
*Identifiers* are either unquoted or double quoted. Identifiers are database names, retention policies, measurements, or tag keys. String literals are always single quoted however.

Double quoted identifiers may contain any unicode character except a new line character. Double quoted identifiers can also contain escaped double quote characters (i.e., `\"`).

Unquoted identifiers must start with an upper or lowercase ASCII letter and can only contain ASCII letters, decimal digits, and the "_" or "." characters.

## Selecting the Database and Retention Period
When selecting data using the query language, the target database and retention period can optionally be specified. Doing so is known as "fully qualifying" your measurement. A fully-qualified measurement is in the following form:

```
"<database>"."<retention period>".<measurement>
```

So, for example, the following statement:

```sql
SELECT value FROM "mydb"."mypolicy".cpu_load
```

queries for data from the measurement `cpu_load` in the database `mydb`, that has been written to the retention policy `mypolicy`. In the event that the database is not specified, the database is determined by the URL parameter `db`. If the retention period is not specified, the query will use the default retention period for the database.

This feature is particularly useful if you wish to query data from different databases or retention periods, in one single query with multiple statements.

## Statements

A query in InfluxDB can have multiple statements separated by semicolons. For example:

```sql
SELECT mean(value) from cpu
WHERE time > now() - 1d
GROUP BY time(10m);
SELECT mean from "hour_summaries".cpu
WHERE time > now() - 7d
```

## Select and Time Ranges

By default, InfluxDB returns data in time-ascending order.

```sql
SELECT value FROM response_times;
```

This simple query pulls the values for the `value` column from the `response_times` series.

### How to set query start and end time

If start and end times aren't set they will default to beginning of time until now, respectively.

The column `time` is built in for every time series in the database. You specify the start and end times by setting conditions on the `time` columns in the where clause.

Below are the different formats that can be used to specify start and end times.

#### Date time strings

Date time strings have the format `YYYY-MM-DD HH:MM:SS.mmm` where `mmm` are the milliseconds within the second. For example:

```sql
SELECT value FROM response_times
WHERE time > '2013-08-12 23:32:01.232' and time < '2013-08-13';
```

The time and date should be wrapped in single quotes. If you only specify the date, the time will be set to `00:00:00`. The `.232` after the hours, minutes, and seconds is optional and specifies the milliseconds.

#### Relative time

You can use `now()` to calculate a timestamp relative to the server's
current timestamp. For example:

```sql
SELECT value FROM response_times WHERE time > now() - 1h limit 1000;
```

will return up to the first 1000 points starting an hour ago until now.

Other options for how to specify time durations are `u` for microseconds, `s` for seconds, `m` for minutes, `h` for hours, `d` for days and `w` for weeks. If no suffix is given the value is interpreted as microseconds.

#### Absolute time

Specify timestamp in epoch time, which is defined as the number of microseconds that have elapsed since 00:00:00 Coordinated Universal Time (UTC), Thursday, 1 January 1970. Use the same suffixes from the previous section to specify timestamps in other units. For example:

```sql
SELECT value FROM response_times WHERE time > 1388534400s
```

will return all points that were writtern after `2014-01-01 00:00:00`

## Regular expressions

Regular expressions are surrounded by `/` characters and use Golang's regular expression syntax.  http://golang.org/pkg/regexp/syntax/.

```sql
/us.*/
```

*NOTE*: Use of regular expressions is explained in the following sections.

## Selecting Multiple Series

Select from multiple series by name or by specifying a regex to match against. Here are a few examples.
```sql
SELECT * FROM events, errors;
```

Get the last hour of data from the two series events, and errors. Here's a regex example:

```sql
SELECT * FROM /^stats\./i WHERE time > now() - 1h;
```

Get the last hour of data from every time series that starts with stats. (case insensitive). Another example:

```sql
SELECT * FROM /.*/ limit 1;
```

Return the last point from every time series in the database.

```sql
SELECT * FROM "otherDB"../disk.*/ LIMIT 1
```

Return the last point from otherDB's default retention policy where the measurement name begins with lowercase disk.

```sql
SELECT * FROM "1h"./disk.*/ LIMIT 1
```

Return the last point from the 1h retention policy where the measurement name begins with lowercase disk.

*NOTE*: Regular expressions cannot be used to specify multiple databases or retention policies. Only measurements.

## Dropping measurements and series

You can drop individual series within a measurement that match given tags, or you can drop entire measurements. Some examples:

```sql
DROP MEASUREMENT response_times
```

Dropping a series by ID:

```sql
DROP SERIES 1
```

Dropping all series that match given tags:

```sql
DROP SERIES
WHERE host = 'serverA'
```

Dropping all series from a measurement that match a given tag:

```sql
DROP SERIES
FROM cpu
WHERE region = 'uswest'
```

## The WHERE Clause

We've already seen the `WHERE` clause for selecting time ranges and a specific point. You can also use it to filter based on given field values, tags, or regexes. Here are some examples of different ways to use `WHERE`.

```sql
SELECT * FROM events WHERE state = 'NY';

SELECT * FROM log_lines WHERE line =~ /error/i;

SELECT * FROM events WHERE customer_id = 23 AND type = 'click';

SELECT * FROM response_times WHERE value > 500 AND region='us-west'

SELECT * FROM events WHERE email !~ /.*gmail.*/;

SELECT * FROM events WHERE signed_in = false;

SELECT * FROM events
WHERE (email =~ /.*gmail.*/ or email =~ /.*yahoo.*/) AND state = 'ny';
```

The WHERE clause supports comparisons against regexes, strings, booleans, floats, integers, and the times listed before. Comparators include `=` equal to, `>` greater than, `<` less than, `<>` not equal to, `=~` matches against, `!~` doesn't match against. You can chain logic together using `AND` and `OR` and you can separate using `(` and `)`

## GROUP BY

The `GROUP BY` clause in InfluxDB is used not only for grouping by given values, but also for grouping by given time buckets. You'll always be pairing this up with [a function](aggregate_functions.html) in the `SELECT` clause and possibly a specific time range in the `WHERE` clause. Here are a few examples to illustrate how `GROUP BY` works.

```sql
-- count of events in the last hour in 10 minute intervals
SELECT count(type) FROM events WHERE time > now() - 1h GROUP BY time(10m)

-- count of each unique type of event in the last hour in 10 minute intervals
SELECT count(type) FROM events WHERE time > now() - 1h GROUP BY time(10m), type

-- count of each unique type of event in the last day grouped by host tag
SELECT count(type) FROM events WHERE time > now() - 1d GROUP BY host

-- 95th percentile of response times in the last day in 30 second intervals
SELECT percentile(value, 95) FROM response_times WHERE time > now() - 1d GROUP BY time(30s)
```

By default functions will output a column that has the same name as the function, e.g. `count` will output a column with the name `count`. In order to change the name of the column an `AS` clause is required. Here is an example to illustrate how aliasing works:

```sql
SELECT count(type) AS number_of_types WHERE time > now() - 1d GROUP BY time(10m);
```

The time function takes the time interval which can be in microseconds, seconds, minutes, hours, days or weeks. To specify the units you can use the respective suffix `u`, `s`, `m`, `h`, `d` and `w`.

If you issue a query that has an aggregate function like `count` but don't specify a `GROUP BY time` You will only get a single data point back with the number of count from time zero (00:00:00 UTC, Thursday, 1 January 1970).

If you have a `GROUP BY time` clause you should **always** have a `WHERE` clause that limits the scope of time you are looking at.

### Filling intervals with no data

By default, `GROUP BY` intervals that have no data will use `null` as the value, by default, though any numerical value, including negative values, are valid values for `fill`. For example, each of the following queries is valid:

```sql
SELECT COUNT(type) FROM events
GROUP BY time(1h) fill(0) WHERE time > now() - 3h
```
```sql
SELECT COUNT(type) FROM events
GROUP BY time(1h) fill(-1) WHERE time > now() - 3h
```

There are also special options for `fill`. Those values are `null`, `previous`, and `none`. `null` means null is used as the value for intervals without data. `previous` means the values of the previous window is used, and `none` means that all null values are removed. Examples of each are shown below.

```sql
SELECT COUNT(type) FROM events
GROUP BY time(1h) fill(null) WHERE time > now() - 3h
```

```sql
SELECT COUNT(type) FROM events
GROUP BY time(1h) fill(previous) WHERE time > now() - 3h
```

```sql
SELECT COUNT(type) FROM events
GROUP BY time(1h) fill(none) WHERE time > now() - 3h
```

Note that `fill` must go at the end of the group by clause if there are other arguments:

```sql
select count(type) from events
group by time(1h), type fill(0) where time > now() - 3h
```

## Merging Series

Queries merge series automatically for you on the fly. Remember that a series is a measurement plus its tag set. This means if you do a query like this:

```
SELECT mean(value)
FROM cpu
WHERE time > now() - 1h
  AND region = 'uswest'
GROUP BY time(1m)
```

All the series under `cpu` that have the tag `region = 'uswest'` will be merged together before computing the mean.

## Getting series with special characters

InfluxDB allows you to use any characters in your time series names. However, parsing queries for those series can be tricky. So it's best to wrap your queries for any series that has characters other than letters in double quotes like this:

```sql
SELECT * FROM "series with special characters!"

SELECT * FROM "series with \"double quotes\""
```

