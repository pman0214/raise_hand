==================
 同期通知サンプル
==================

概要
====

質問がある人がボタンを押すと通知される。

構成
====

======================= ==============================
file                    内容
======================= ==============================
public/index.html       質問ボタンページ
public/raised.html      質問有無確認ページ
public/css/             スタイルファイル
public/js/raise.js      質問通知処理用JavaScript
public/js/raised.js     質問通知受信用JavaScript
======================= ==============================

Usage
=====

Replace ``URL_TO_YOUR_PAGE`` in ``public/firebase-messaging-sw.js`` with your page URL.
``YOUR_API_KEY``, ``YOUR_DOMAIN``, ``YOUR_DB_URL``, ``YOUR_STORAGE``, ``YOUR_SENDER_ID``, ``YOUR_FCM_TOKEN`` in ``public/js/raise.js`` and ``public/js/raised.js`` should also be updated with your own parameters, which are derived in your App initialization codes.

Finally, deploy your app using firebase CLI!


Copyright, License
==================
   
* Copyright (c) 2016, Shigemi ISHIDA.
* Copyright 2013 Yahoo! Inc. All rights reserved.
* Copyright 2015 Google Inc.

This software is released under the BSD 3-clause license.
See ``LICENSE``.

Files listed below are retrieved from `Pure.css <http://purecss.io/>`_ and are also released under BSD license.
See ``LICENSE-pure.md``.

* ``public/css/pure-min.css``
* ``public/css/grids-responsive-min.css``
* ``public/css/grids-responsive-old-ie-min.css``

This software includes the work that is distributed in the Apache License 2.0.
See ``LICENSE-apache``.
