---
title: Getting Started with InfluxDB
---

# Getting Started

Now that you've [installed InfluxDB](installation.html) you're ready to start doing awesome things. In this section we're going to use the built in user interface to get started quickly.

_Note: The database can also be used by directly making requests to the API. See [Reading and Writing Data](../concepts/reading_and_writing_data.html) for examples._

## Logging in and creating your first database
If you've installed locally, point your browser to <a href="http://localhost:8083" target="_blank">localhost:8083</a>. The built in user interface runs on port `8083` by default. You should see a screen like this:

![Admin login](/images/docs/admin_login.jpg)

Click "Connect". The default options for hostname of `localhost` and port of `8086` should work, since the InfluxDB HTTP API runs on port `8086` by default.

![Logged in with no databases](/images/docs/logged_in_no_databases.jpg)

Enter in `mydb` as a database name and click "Create". Database names should contain only ASCII letters, decimal numbers, or underscores and start with an ASCII letter or underscore. Databases you create will be listed on the screen:

![Database list screen](/images/docs/database_created.jpg)

## Writing and exploring data in the UI
Go ahead and click the "Explore Data" link for the `mydb` database you created earlier, which will bring you to this screen:

![Explore data interface](/images/docs/explore_screen.jpg)

From this screen you can write some test data. More importantly, you'll be able to issue ad-hoc queries and see basic visualizations. Let's write a little data in to see how things work. Data in InfluxDB is organized by `time series`, which describes a measurement, like "cpu_load" or "temperature". Time series have zero to many `points` which contain the data. Points consist of a timestamp (labelled `time`), at least one `field` (the measurement itself), and zero to many key-value `tags` containing metadata. Conceptually you can think of it like SQL tables, with rows where the primary index is always time. The difference is that with InfluxDB you can have millions of series, you don't have to define schemas up front, and null values aren't stored.

Let's write some data. Here are a couple of examples of things we'd want to write. We'll show the screenshot and what the JSON data looks like right after. (Note that database, field, and tag names containing any character other than [A-Z,a-z,0-9,_] or starting with one or more digits must be double-quoted.)

![Storing log lines](/images/docs/log_lines.jpg)

To insert a single time-series datapoint into InfluxDB, enter the following in the `Values` textbox:

```json
{
    "database": "mydb",
    "points": [
        {
            "name": "cpu_load_short",
            "tags": {
                "host": "server01"
            },
            "time": "2009-11-10T23:00:00Z",
            "fields": {
                "value": 0.64
            }
        }
    ]
}
```

And now let's take a look at how we query for this data. In the `Query` textbox, enter the following command:

```sql
SELECT * FROM cpu_load_short
```

Note that the keywords are capitalized for clarity, but keywords are not case-sensitive.

The JSON response is as follows:

```json
{
    "results": [
        {
            "series": [
                {
                    "name": "cpu_load_short",
                    "tags": {
                        "host": "server01"
                    },
                    "columns": [
                        "time",
                        "value"
                    ],
                    "values": [
                        "2009-11-10T23:00:00Z",
                        0.64
                    ]
                }
            ]
        }
    ]
}
```

Let's try storing a different type of data -- sensor data. Enter the following data in the `Values` textbox:

```json
{
    "database": "mydb",
    "points": [
        {
            "name": "temperature",
            "tags": {
                "machine": "unit42",
                "type": "assembly"
            },
            "time": "2009-11-10T23:00:00Z",
            "fields": {
                "external": 25,
                "internal": 37
            }
        }
    ]
}
```
Note that in this example we write two values in the `fields` object. Up to 255 different values can be stored as `fields`.

Resulting JSON that will get returned on query:

```json
{
    "results": [
        {
            "series": [
                {
                    "name": "temperature",
                    "tags": {
                        "machine": "unit42",
                        "type": "assembly"
                    },
                    "columns": [
                        "time",
                        "external",
                        "internal"
                    ],
                    "values": [
                        "2009-11-10T23:00:00Z",
                        25,
                        37
                    ]
                }
            ]
        }
    ]
}
```

InfluxDB supports a sophisticated query language, allowing many different types of queries. For example:

```sql
SELECT * FROM /.*/ LIMIT 1
--
SELECT * FROM cpu_load_short
--
SELECT * FROM cpu_load_short WHERE value > 0.9
```

This is all you need to know to write data into InfluxDB and query it back. Of course, to write significant amounts of data you will want to access the HTTP API directly, or use one of the many client libraries. 
