---
title: InfluxDB v0.9.0 release update 3
author: Paul Dix
published_on: June 5, 2015
---

This is a quick update on the 0.9.0 release status. In the past four weeks we completely [reworked the clustering](http://influxdb.com/blog/2015/06/03/InfluxDB_clustering_design.html) and write path of InfluxDB. This work is in RC32, which we'll be cutting later today. The stability of a single server should be greatly improved with a performance improvement as well.

RC32 is a major step forward in 0.9.0. Unfortunately, with this release you'll have to blow away any old data and config files. The format of both have changed. The good news is that it won't be changing again before the 0.9.0 release, which we'll be cuttig very soon. We've now set up the data so that each shard is self describing. That is, it has the metadata for what series exist in the shard stored locally.

What this means for us going forward is that we can make improvements to the underlying storage engine and representation without requiring users to migrate their data. They'll be able to run old shard versions along with new shard versions all in the same database.

This release also has a new [line protocol for writing data](https://github.com/influxdb/influxdb/pull/2696). Going forward this will be the preferred method for writing data into InfluxDB. The performance of it is vastly greater than the previous JSON protocol.

In the coming weeks we're going to release 0.9.0 as a stable single server version with clustering marked as alpha. There's enough there that people can benefit from having a single server version running or even a cluster running that is fully replicated, thus giving InfluxDB users an option for high availability.

Once 0.9.0 is released we'll be getting on a regular release cadence, with a point release every 3 weeks. This will give us 2 weeks of feature development and 1 week of testing. In the interim we'll release patch fixes if there are any showstopper bugs found. This will get us back on the path of regular, continuous and incremental improvement. Every point release in the 0.9 line will be a drop in replacement.