==================
 同期通知サンプル
==================

概要
====

Firebase Cloud Messagingを使って作成した、ボタンを押すと通知されるページのサンプルです。

Requirements
============

Firebaseの開発環境が必要です。
Node.jsをインストールした状態で、npmでインストールしてください。

.. code-block:: bash

   % npm install -g firebase-tools

構成
====

============================ ===================================
file                         内容
============================ ===================================
public/index.html            質問ボタンページ
public/raised.html           質問有無確認ページ
public/time_schedule.json    時間制限設定ファイル（サンプル）
public/css/                  スタイルファイル
public/js/raise.js           質問通知処理用JavaScript
public/js/raised.js          質問通知受信用JavaScript
============================ ===================================

Usage
=====

``public/firebase-messaging-sw.js`` 内の ``URL_TO_YOUR_PAGE`` を自分のページURLに書き換えてください。
``public/js/raise.js`` 内の ``YOUR_API_KEY``, ``YOUR_DOMAIN``, ``YOUR_DB_URL``, ``YOUR_STORAGE``, ``YOUR_SENDER_ID``, ``YOUR_FCM_TOKEN``  and ``public/js/raised.js`` も同様に書き換える必要があります。
これらの値はApp initialization codesから取得できます。

時間制限を設けたい場合には ``public/time_schedule.json`` に記載してください。
時間制限設定ファイルが無い場合とJSONの解析エラーを判別するのが面倒なため、時間制限を設けない場合には長い範囲で時間制限を指定すればOKです（1910年1月1日〜2100年12月31日まで、のように）。

firebaseの設定を施します。
設定は指示に従えば問題ないかと思います。

.. code-block:: bash

   % firebase init

最後にfirebase CLIを使ってデプロイします。

.. code-block:: bash

   % firebase deploy

手元でテストしたい場合は ``firebase serve`` してください。

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
