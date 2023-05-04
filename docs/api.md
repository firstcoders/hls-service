<!-- Generator: Widdershins v4.0.1 -->

<h1 id="hls-service-api">HLS Service API v1.0.0</h1>

> Scroll down for code samples, example requests and responses. Select a language for code samples from the tabs above or the mobile navigation menu.

A serverless micro-service to transcode audio into HLS format

Base URLs:

* <a href="https://api.example.com/v1">https://api.example.com/v1</a>

# Authentication

- HTTP Authentication, scheme: bearer 

<h1 id="hls-service-api-default">Default</h1>

## getM3u8

<a id="opIdgetM3u8"></a>

> Code samples

```http
GET https://api.example.com/v1/?sourceUrl=https%3A%2F%2Fabcdefg01234.cloudfront.net%2Fdrums-wav HTTP/1.1
Host: api.example.com
Accept: application/x-mpegURL

```

`GET /`

*Generates a m3u8 file given a wav*

Takes a sourceUrl for a WAV and returns a m3u8 playlist

<h3 id="getm3u8-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|sourceUrl|query|string|true|none|

> Example responses

> 200 Response

<h3 id="getm3u8-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Success|string|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

