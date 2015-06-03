---
title: InfluxDB v0.9.0 release update 2
author: Paul Dix
published_on: May 19, 2015
---

Here's the latest update on our path to InfluxDB 0.9.0. Since the last [release update 18 days ago](/blog/2015/04/01/InfluxDB-v0_9_0-release-update.html), we've merged 44 PRs to add features or close out bugs. Most notable on the feature side of things are `non_negative_derivative`, `derivative`. and `distinct`, with `count(distinct)` coming in the next few days.

We also have some changes we'll make over the next two weeks that are minor cosmetic changes to the API that are breaking changes: [#2564](https://github.com/influxdb/influxdb/issues/2564), [#2563](https://github.com/influxdb/influxdb/issues/2563).

Most of the other outstanding issues have to do with clustering or performance that is impacted because of the write path, which goes through clustering. We've learned a ton over the last year about clustering, distributed systems, and the often infuriating ways in which they fail. Our goal is to get 0.9.0 out as soon as possible with a clustering foundation that can be built upon.

Based on our testing over the last few months we're updating the design of clustering from what we were previously planning. What this means is that 0.9.0 will likely be a more limited release with respect to clustering. However, it's the implementation that we will be pushing forward and will be the foundation for a reliable and scalable clustering implementation.

Once we've cut 0.9.0 we'll be getting on a fairly regular release cadence of a point release every 3 weeks. That'll include 2 weeks of feature development and 1 week of testing before the release. Some of these features will be new aggregate functions, but some of them will be clustering features.

This is our plan going forward that will get us back to shipping regular updates and getting continual improvement. I'll be posting a detailed writeup about the new clustering design in the next week and updating on our progress in two weeks.