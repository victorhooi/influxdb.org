---
title: InfluxDB Aggregate Functions
alias: docs/query_language/functions.html
---

# Aggregate Functions

InfluxDB contains a number of functions that you can use for computing aggregates, rollups, or doing downsampling on the fly. These are usually used in conjunction with a `GROUP BY time(...)` clause. Note that the use of a `GROUP BY` clause necessitates a `WHERE time` clause. 

When performing an aggregation without a `GROUP BY` clause, the timestamp returned with the aggregated value(s) will be epoch 0 (1970-01-01T00:00:00Z).

## Count

COUNT() takes a single field key as the only argument. It returns the number of points that contain a non-NULL value for that field. If a GROUP BY is supplied, COUNT() will return the number of points per GROUP BY interval that have a non-NULL value for the given field.

```sql
SELECT COUNT(field_key) FROM measurement

SELECT COUNT(field_key) FROM measurement WHERE time > now() - 1d GROUP BY time(10m)
```

## Min

MIN() returns the lowest value from the specified field over a given interval. The field must contain int64 or float64 values.

```sql
SELECT MIN(field_key) FROM measurement

SELECT MIN(field_key) FROM measurement WHERE time > now() - 1d GROUP BY time(10m)
```

## Max

MAX() returns the highest value from the specified field over a given interval. The field must be of type int64 or float64.

```sql
SELECT MAX(field_key) FROM measurement 

SELECT MAX(field_key) FROM measurement WHERE time > now() - 1d GROUP BY time(10m)
```

## Mean

MEAN() returns the arithmetic mean (average) of the specified field over a given interval. The field must be of type int64 or float64.

```sql
SELECT MEAN(field_key) FROM measurement

SELECT MEAN(field_key) FROM measurement WHERE time > now() - 1d GROUP BY time(10m)
```

## Median

MEDIAN() returns the middle value from a sorted set of values for the specified field over a given interval. The field must be of type int64 or float64. This is nearly equivalent to PERCENTILE(field_key, 50), except that in the event a dataset contains an even number of points, the median will be the average of the two middle values.

```sql
SELECT MEDIAN(field_key) FROM measurement

SELECT MEDIAN(field_key) FROM measurement WHERE time > now() - 1d GROUP BY time(10m)
```

## Distinct

DISTINCT() returns an array of unique values for the given field.

```sql
SELECT DISTINCT(field_key) FROM measurement 

SELECT DISTINCT(field_key) FROM measurement WHERE time > now() - 1d GROUP BY time(10m)
```

You can nest distinct in count to get the counts of unique values over windows of time:

```sql
SELECT COUNT(DISTINCT(field_key)) from measurement

SELECT COUNT(DISTINCT(field_key)) FROM measurement WHERE time > now() - 1d GROUP BY time(10m)
```

## Percentile

PERCENTILE() returns the Nth percentile value of a sorted set of values for the specified field. The values are sorted in ascending order with the lowest value at 0% and the highest value at 100%. The Nth percentile value is thus the one that is larger than N% of the values in the interval. PERCENTILE() requires two arguments, the first being the field and the second being the desired percentile, which must be an integer or floating point number between 0 and 100, inclusive. The field must be of type int64 or float64. PERCENTILE(value, 0) is equivalent to MIN(value), and PERCENTILE(value, 100) is equivalent to MAX(value)

```sql
SELECT PERCENTILE(field_key, N) FROM measurement

SELECT PERCENTILE(field_key, N) FROM measurement WHERE time > now() - 1d GROUP BY time(10m)
```

## Derivative

This definition is a work in progress, suggestions welcome.

DERIVATIVE() requires exactly one argument, which is a field name. The out is a field containing the value of `(v_last - v_first) / (t_last - t_first)` where `v_last` is the last value of the given field and `t_last` is the corresponding timestamp (and similarly for `v_first` and `t_first`). In other words, DERIVATIVE() calculates the **rate of change** of the given field.

```sql
SELECT DERIVATIVE(field_key) FROM measurement ...
```

## Sum

SUM() requires exactly one argument, which is a field name. It outputs the sum of the all values for the given field. The field must be of type int64 or float64.

```sql
SELECT SUM(field_key) FROM measurement ...
```

## Stddev

STDDEV() requires exactly one argument, which is a field name. It outputs the standard deviation of the given field. The field must be of type int64 or float64.

```sql
SELECT STDDEV(field_key) FROM measurement ...
```

## First

FIRST() requires exactly one argument, which is a field name. It will output the first (oldest) point for each group by interval, sorted by time.

```sql
SELECT FIRST(field_key) FROM measurement ...
```

## Last

LAST() requires exactly one argument, which is a field name. It will output the last (newest) point for each group by interval, sorted by time.

```sql
SELECT LAST(field_key) FROM measurement ...
```
