if(!self.define){let e,a={};const s=(s,c)=>(s=new URL(s+".js",c).href,a[s]||new Promise((a=>{if("document"in self){const e=document.createElement("script");e.src=s,e.onload=a,document.head.appendChild(e)}else e=s,importScripts(s),a()})).then((()=>{let e=a[s];if(!e)throw new Error(`Module ${s} didn’t register its module`);return e})));self.define=(c,i)=>{const t=e||("document"in self?document.currentScript.src:"")||location.href;if(a[t])return;let r={};const n=e=>s(e,t),o={module:{uri:t},exports:r,require:n};a[t]=Promise.all(c.map((e=>o[e]||n(e)))).then((e=>(i(...e),r)))}}define(["./workbox-4754cb34"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/Golpo Images/ChaulerBosta/chauler-bosta-banner.webp",revision:"c03ff947b1477359f9912d439aea84f1"},{url:"/Golpo Images/ChaulerBosta/chauler-bosta-landscape.webp",revision:"30eb0e0b996dd76a415e050495ea297f"},{url:"/Golpo Images/ChaulerBosta/chauler-bosta-portrait.webp",revision:"f064a8400ab5a66b41035fb2de8473b2"},{url:"/Golpo Images/ChaulerBosta/chauler-bosta-squares.webp",revision:"70c0af6e78715d6c551ea5f4ab41914a"},{url:"/Golpo Images/ChaulerBosta/chaulerbosta-cardratio.webp",revision:"09c42d850cee03bcbb69620e745a81ca"},{url:"/Golpo Images/ChaulerBosta/logo.webp",revision:"14227fe05a2ced6335b008d319ce7073"},{url:"/Golpo Images/Chesrami/chearami-landscape.webp",revision:"f4ff934775082f0edd58ece196fcf539"},{url:"/Golpo Images/Chesrami/chesrami logo.webp",revision:"14552604b87cc4f19bd5d7aa12477eeb"},{url:"/Golpo Images/Chesrami/chesrami-banner.webp",revision:"c244f644b165ed4ca4a50a56edce7d05"},{url:"/Golpo Images/Chesrami/chesrami-cardratio.webp",revision:"527276d72299e9445fa74bee0ee9d31d"},{url:"/Golpo Images/Chesrami/chesrami-portrait.webp",revision:"5c3c3addd71a6cd5d6678e25373eb2cb"},{url:"/Golpo Images/Chesrami/chesrami-squares.webp",revision:"baa1bc448c0e083cb42d11df99d3e40b"},{url:"/Golpo Images/Irsha/irsha-banner.webp",revision:"672302450fefde8699072f7f9a9c7c75"},{url:"/Golpo Images/Irsha/irsha-cardratio.webp",revision:"974cbc10e78f987f4fb8d08729bdf76c"},{url:"/Golpo Images/Irsha/irsha-landscape.webp",revision:"75a9ffe56ea639c2e9b247e75e441b3a"},{url:"/Golpo Images/Irsha/irsha-logo.webp",revision:"00c67a04ee09a7b02a285a89c8e1caa2"},{url:"/Golpo Images/Irsha/irsha-portrait.webp",revision:"28da22494e6a613f6121820d6742816e"},{url:"/Golpo Images/Irsha/irsha-squares.webp",revision:"fd60b301944fec9658869a5c26320a0b"},{url:"/Golpo Images/JibonerSarangsho/jiboner-sarangsho-banner.webp",revision:"a6b8ca68c55ac3cc8dc20ad707a376b0"},{url:"/Golpo Images/JibonerSarangsho/jiboner-sarangsho-landscape.webp",revision:"cdb0626c3e6b14cd187e1ec5ed5fb056"},{url:"/Golpo Images/JibonerSarangsho/jiboner-sarangsho-logo.webp",revision:"eebe2f277fb906996ee67440da10d626"},{url:"/Golpo Images/JibonerSarangsho/jiboner-sarangsho-portrait.webp",revision:"83c6d0b627e6de7c6926bcafff4e57b9"},{url:"/Golpo Images/JibonerSarangsho/jiboner-sarangsho-squares.webp",revision:"9d2d38d7dde1c9dc5ab98f127163e7bd"},{url:"/Golpo Images/JibonerSarangsho/jibonersarangsho-cardratio.webp",revision:"9d184d2b8fc67ba946b43261959429ed"},{url:"/Golpo Images/OpurnoValobasha/opurnovalobasha-banner.webp",revision:"9e366a82bf2a4702125b8ac6f79be340"},{url:"/Golpo Images/OpurnoValobasha/opurnovalobasha-cardratio.webp",revision:"6f18432ddc1bb428b92bd7de0fe23fbf"},{url:"/Golpo Images/OpurnoValobasha/opurnovalobasha-landscape.webp",revision:"f858cbbabfa54408fb80d6b812292fc0"},{url:"/Golpo Images/OpurnoValobasha/opurnovalobasha-logo.webp",revision:"0f0fed3f5945f40539a767738514cec3"},{url:"/Golpo Images/OpurnoValobasha/opurnovalobasha-portrait.webp",revision:"43b6fc2f0f24d793bb3cbe64a8e33011"},{url:"/Golpo Images/OpurnoValobasha/opurnovalobasha-square.webp",revision:"6d6d383dbf96989830e530952201b065"},{url:"/Golpo Images/Porichoy/porichoy-banner.webp",revision:"411a998931b7a0c88a42cf35d14a8135"},{url:"/Golpo Images/Porichoy/porichoy-cardratio.webp",revision:"1111a8356dea5be7f42cdabbb9eb8b5b"},{url:"/Golpo Images/Porichoy/porichoy-landscape.webp",revision:"30ccc40c72a864f73ecb1bfa6518322d"},{url:"/Golpo Images/Porichoy/porichoy-logo.webp",revision:"043298275a16faa23586caf157a84374"},{url:"/Golpo Images/Porichoy/porichoy-portrait.webp",revision:"2cf1404775cf76110af53f990ac016b2"},{url:"/Golpo Images/Porichoy/porichoy-squares.webp",revision:"4c68a81128af7888dd9560bafd722bc4"},{url:"/Golpo Images/baba/baba-banner.webp",revision:"6c4c28264c4dd98ab7ebb6c3317a7088"},{url:"/Golpo Images/baba/baba-cardratio.webp",revision:"7de13f0c4025364a6969587e667ab203"},{url:"/Golpo Images/baba/baba-landscape.webp",revision:"05ff36c1dea2ef1529ec578ccc16cbcd"},{url:"/Golpo Images/baba/baba-logo.webp",revision:"82456e0ab8c2b369b343c32c58ecde35"},{url:"/Golpo Images/baba/baba-portrait.webp",revision:"665b9a5390e506ecbac068ffa7b963ac"},{url:"/Golpo Images/baba/baba-square.webp",revision:"fd8477472af296b8b6226b35bb68c6cd"},{url:"/Golpo Images/loveDotCom/lovedotcom-banner.webp",revision:"61a78fab81c2828fb24eaecbad5bec56"},{url:"/Golpo Images/loveDotCom/lovedotcom-cardratio.webp",revision:"cf5e4f8375c837202396b00b07fc23ae"},{url:"/Golpo Images/loveDotCom/lovedotcom-landscape.webp",revision:"80e1b27aba6030e821082fe70c59f8da"},{url:"/Golpo Images/loveDotCom/lovedotcom-logo.webp",revision:"07f77dbacfb5e868e95a0d6f8e9b0a00"},{url:"/Golpo Images/loveDotCom/lovedotcom-portrait.webp",revision:"900b1c5fd9302412fe3129d287ac7dee"},{url:"/Golpo Images/loveDotCom/lovedotcom-squres.webp",revision:"dd9f4b97bb0c4380b24316d4f4db7803"},{url:"/_next/app-build-manifest.json",revision:"78da582792cf3c2a94b7f1a88fa72063"},{url:"/_next/static/chunks/0e762574-83ee46728bb8a468.js",revision:"tIAC7qZqKaStYMNLXlgC6"},{url:"/_next/static/chunks/1684-5471f94011afb066.js",revision:"tIAC7qZqKaStYMNLXlgC6"},{url:"/_next/static/chunks/2108-d178e0477b324aed.js",revision:"tIAC7qZqKaStYMNLXlgC6"},{url:"/_next/static/chunks/3063-3797a37935dd4fd0.js",revision:"tIAC7qZqKaStYMNLXlgC6"},{url:"/_next/static/chunks/30a37ab2-2bff04113da4fab5.js",revision:"tIAC7qZqKaStYMNLXlgC6"},{url:"/_next/static/chunks/3464-bdd3038f5fc63d21.js",revision:"tIAC7qZqKaStYMNLXlgC6"},{url:"/_next/static/chunks/385cb88d-e8fec2c6d1992e3d.js",revision:"tIAC7qZqKaStYMNLXlgC6"},{url:"/_next/static/chunks/3d47b92a-67652e6cd0920a77.js",revision:"tIAC7qZqKaStYMNLXlgC6"},{url:"/_next/static/chunks/472.a3826d29d6854395.js",revision:"a3826d29d6854395"},{url:"/_next/static/chunks/497-cbf9a4f22eb0c0c4.js",revision:"tIAC7qZqKaStYMNLXlgC6"},{url:"/_next/static/chunks/4bd1b696-d6fa094c9b7afa79.js",revision:"tIAC7qZqKaStYMNLXlgC6"},{url:"/_next/static/chunks/6874-410d36c7d457df80.js",revision:"tIAC7qZqKaStYMNLXlgC6"},{url:"/_next/static/chunks/795d4814-574d87e0d5612560.js",revision:"tIAC7qZqKaStYMNLXlgC6"},{url:"/_next/static/chunks/8278-f36ff01af272e014.js",revision:"tIAC7qZqKaStYMNLXlgC6"},{url:"/_next/static/chunks/8779-80babc725ae8d860.js",revision:"tIAC7qZqKaStYMNLXlgC6"},{url:"/_next/static/chunks/8e1d74a4-a2debfb949c291a3.js",revision:"tIAC7qZqKaStYMNLXlgC6"},{url:"/_next/static/chunks/9341.48099055d616fd0a.js",revision:"48099055d616fd0a"},{url:"/_next/static/chunks/9c4e2130-5633b239bd2b03b1.js",revision:"tIAC7qZqKaStYMNLXlgC6"},{url:"/_next/static/chunks/app/%5BcContentType%5D/%5BcId%5D/%5BseasonId%5D/%5BepisodeId%5D/page-432675b47e430d08.js",revision:"tIAC7qZqKaStYMNLXlgC6"},{url:"/_next/static/chunks/app/%5BcContentType%5D/%5BcId%5D/%5BseasonId%5D/page-e9cf9b466e1cbff4.js",revision:"tIAC7qZqKaStYMNLXlgC6"},{url:"/_next/static/chunks/app/%5BcContentType%5D/%5BcId%5D/page-2370a1d9b673f782.js",revision:"tIAC7qZqKaStYMNLXlgC6"},{url:"/_next/static/chunks/app/%5BcContentType%5D/page-e014ac840e45c399.js",revision:"tIAC7qZqKaStYMNLXlgC6"},{url:"/_next/static/chunks/app/(Authentication)/login/page-01a5b10e0f5d2c79.js",revision:"tIAC7qZqKaStYMNLXlgC6"},{url:"/_next/static/chunks/app/(Authentication)/register/page-d895cf6b67bddf0c.js",revision:"tIAC7qZqKaStYMNLXlgC6"},{url:"/_next/static/chunks/app/(More)/aboutus/page-5dd11513b0f4cef7.js",revision:"tIAC7qZqKaStYMNLXlgC6"},{url:"/_next/static/chunks/app/(More)/bookmarks/page-1550d6424df7ec4b.js",revision:"tIAC7qZqKaStYMNLXlgC6"},{url:"/_next/static/chunks/app/(More)/privacypolicy/page-235ff0b92a9f5031.js",revision:"tIAC7qZqKaStYMNLXlgC6"},{url:"/_next/static/chunks/app/(More)/termsofuse/page-f255965559820e85.js",revision:"tIAC7qZqKaStYMNLXlgC6"},{url:"/_next/static/chunks/app/_not-found/page-fd2a302519f6b30d.js",revision:"tIAC7qZqKaStYMNLXlgC6"},{url:"/_next/static/chunks/app/admin/editing/restricted/page-13adf597b83a688d.js",revision:"tIAC7qZqKaStYMNLXlgC6"},{url:"/_next/static/chunks/app/api/%5BcId%5D/%5BsId%5D/%5BeId%5D/route-703ff36f3dceaa63.js",revision:"tIAC7qZqKaStYMNLXlgC6"},{url:"/_next/static/chunks/app/api/auth/%5B...nextauth%5D/route-c2f44c485e2ddf25.js",revision:"tIAC7qZqKaStYMNLXlgC6"},{url:"/_next/static/chunks/app/api/auth/register/route-349ee32984fe068e.js",revision:"tIAC7qZqKaStYMNLXlgC6"},{url:"/_next/static/chunks/app/api/authorscrud/%5BauthorId%5D/route-d3c9bb78e9ba2463.js",revision:"tIAC7qZqKaStYMNLXlgC6"},{url:"/_next/static/chunks/app/api/authorscrud/authorGet/route-0dcc451479403cbb.js",revision:"tIAC7qZqKaStYMNLXlgC6"},{url:"/_next/static/chunks/app/api/authorscrud/authorPost/route-a9e0006827ddd6ca.js",revision:"tIAC7qZqKaStYMNLXlgC6"},{url:"/_next/static/chunks/app/api/bookmark/bookmarkget/route-cb4ba4a5d5c26f8e.js",revision:"tIAC7qZqKaStYMNLXlgC6"},{url:"/_next/static/chunks/app/api/bookmark/bookmarkpost/route-c8e0a2968d7e77c8.js",revision:"tIAC7qZqKaStYMNLXlgC6"},{url:"/_next/static/chunks/app/api/check-username/route-89bf906269f42dcf.js",revision:"tIAC7qZqKaStYMNLXlgC6"},{url:"/_next/static/chunks/app/api/contentcrud/%5BcId%5D/route-f5ffa28ec45ec2cd.js",revision:"tIAC7qZqKaStYMNLXlgC6"},{url:"/_next/static/chunks/app/api/contentcrud/audioget/route-ede73242f7ef422d.js",revision:"tIAC7qZqKaStYMNLXlgC6"},{url:"/_next/static/chunks/app/api/contentcrud/byAuthor/%5BauthorId%5D/route-6c9fe0b45e28c576.js",revision:"tIAC7qZqKaStYMNLXlgC6"},{url:"/_next/static/chunks/app/api/contentcrud/byBookmark/route-03ebfcc10b7fb99e.js",revision:"tIAC7qZqKaStYMNLXlgC6"},{url:"/_next/static/chunks/app/api/contentcrud/byGenre/%5BgenreId%5D/route-b42ee414bcedd811.js",revision:"tIAC7qZqKaStYMNLXlgC6"},{url:"/_next/static/chunks/app/api/contentcrud/bySeason/%5BcContentType%5D/%5BcId%5D/%5BcSeasons%5D/route-3f7623d5376e2a2c.js",revision:"tIAC7qZqKaStYMNLXlgC6"},{url:"/_next/static/chunks/app/api/contentcrud/contentget/route-da7e8977083b4f83.js",revision:"tIAC7qZqKaStYMNLXlgC6"},{url:"/_next/static/chunks/app/api/contentcrud/contentgetfull/route-57f65b1559c5a194.js",revision:"tIAC7qZqKaStYMNLXlgC6"},{url:"/_next/static/chunks/app/api/contentcrud/contentpost/route-0e0af7b0fb4cd953.js",revision:"tIAC7qZqKaStYMNLXlgC6"},{url:"/_next/static/chunks/app/api/episodescrud/episodespost/route-7de7967739f82964.js",revision:"tIAC7qZqKaStYMNLXlgC6"},{url:"/_next/static/chunks/app/api/episodesummary/%5BcId%5D/%5BsId%5D/route-2bee9b49f9a6f635.js",revision:"tIAC7qZqKaStYMNLXlgC6"},{url:"/_next/static/chunks/app/api/genrecrud/%5BgenreId%5D/route-d30b856f7bed15d1.js",revision:"tIAC7qZqKaStYMNLXlgC6"},{url:"/_next/static/chunks/app/api/genrecrud/genreget/route-3006c0eaa5feeb64.js",revision:"tIAC7qZqKaStYMNLXlgC6"},{url:"/_next/static/chunks/app/api/genrecrud/genrepost/route-b62321fd2562189f.js",revision:"tIAC7qZqKaStYMNLXlgC6"},{url:"/_next/static/chunks/app/api/seasonscrud/seasonspost/route-b1991af78d83645c.js",revision:"tIAC7qZqKaStYMNLXlgC6"},{url:"/_next/static/chunks/app/api/send-otp/route-1067cf9bb2ba55ae.js",revision:"tIAC7qZqKaStYMNLXlgC6"},{url:"/_next/static/chunks/app/api/subscriberwithemail/route-2a23d3bad919bedc.js",revision:"tIAC7qZqKaStYMNLXlgC6"},{url:"/_next/static/chunks/app/api/update-profile/route-3ccedc41a537ac53.js",revision:"tIAC7qZqKaStYMNLXlgC6"},{url:"/_next/static/chunks/app/api/user/update/route-43f037863281dbd4.js",revision:"tIAC7qZqKaStYMNLXlgC6"},{url:"/_next/static/chunks/app/api/verify-otp/route-0a0d49c540a37b77.js",revision:"tIAC7qZqKaStYMNLXlgC6"},{url:"/_next/static/chunks/app/audiobooks/page-6872b9470b31f559.js",revision:"tIAC7qZqKaStYMNLXlgC6"},{url:"/_next/static/chunks/app/authors/%5BauthorId%5D/page-1125dc1d61fd2c86.js",revision:"tIAC7qZqKaStYMNLXlgC6"},{url:"/_next/static/chunks/app/authors/page-7f5e0cc0b0038820.js",revision:"tIAC7qZqKaStYMNLXlgC6"},{url:"/_next/static/chunks/app/genres/%5BgenreId%5D/page-4de12951d2972e98.js",revision:"tIAC7qZqKaStYMNLXlgC6"},{url:"/_next/static/chunks/app/genres/page-d7c7630a2398047a.js",revision:"tIAC7qZqKaStYMNLXlgC6"},{url:"/_next/static/chunks/app/layout-936582cfa89f2311.js",revision:"tIAC7qZqKaStYMNLXlgC6"},{url:"/_next/static/chunks/app/not-found-c968a8c12da87ade.js",revision:"tIAC7qZqKaStYMNLXlgC6"},{url:"/_next/static/chunks/app/page-d758ef56f3a8bb3b.js",revision:"tIAC7qZqKaStYMNLXlgC6"},{url:"/_next/static/chunks/app/profile/%5Bid%5D/page-b1004dccb5a663aa.js",revision:"tIAC7qZqKaStYMNLXlgC6"},{url:"/_next/static/chunks/b563f954-cf0a31ae749e176f.js",revision:"tIAC7qZqKaStYMNLXlgC6"},{url:"/_next/static/chunks/c916193b-cf95cbc5f3202afb.js",revision:"tIAC7qZqKaStYMNLXlgC6"},{url:"/_next/static/chunks/e34aaff9-956e5ee75ecc5379.js",revision:"tIAC7qZqKaStYMNLXlgC6"},{url:"/_next/static/chunks/f25cdb8d-0bf931a622c626a2.js",revision:"tIAC7qZqKaStYMNLXlgC6"},{url:"/_next/static/chunks/f8025e75-4d6f7a23dd03fd55.js",revision:"tIAC7qZqKaStYMNLXlgC6"},{url:"/_next/static/chunks/f97e080b-ab406b303c36039e.js",revision:"tIAC7qZqKaStYMNLXlgC6"},{url:"/_next/static/chunks/fc2f6fa8-fb905fc9b3f2aa3e.js",revision:"tIAC7qZqKaStYMNLXlgC6"},{url:"/_next/static/chunks/framework-dcd2c1f5d9432bec.js",revision:"tIAC7qZqKaStYMNLXlgC6"},{url:"/_next/static/chunks/main-app-5a071464cc932efd.js",revision:"tIAC7qZqKaStYMNLXlgC6"},{url:"/_next/static/chunks/main-b48584b0f2a5f69f.js",revision:"tIAC7qZqKaStYMNLXlgC6"},{url:"/_next/static/chunks/pages/_app-c5edea036b2e1360.js",revision:"tIAC7qZqKaStYMNLXlgC6"},{url:"/_next/static/chunks/pages/_error-a0194b07e927b492.js",revision:"tIAC7qZqKaStYMNLXlgC6"},{url:"/_next/static/chunks/polyfills-42372ed130431b0a.js",revision:"846118c33b2c0e922d7b3a7676f81f6f"},{url:"/_next/static/chunks/reactPlayerDailyMotion.7e7fc64dfe0fe9cb.js",revision:"7e7fc64dfe0fe9cb"},{url:"/_next/static/chunks/reactPlayerFacebook.04ab31a4844b5612.js",revision:"04ab31a4844b5612"},{url:"/_next/static/chunks/reactPlayerFilePlayer.d53bc3b12064a88a.js",revision:"d53bc3b12064a88a"},{url:"/_next/static/chunks/reactPlayerKaltura.c33209a7ccc9b480.js",revision:"c33209a7ccc9b480"},{url:"/_next/static/chunks/reactPlayerMixcloud.5a809ffc7c7893ca.js",revision:"5a809ffc7c7893ca"},{url:"/_next/static/chunks/reactPlayerMux.b0bb3cadcedf432b.js",revision:"b0bb3cadcedf432b"},{url:"/_next/static/chunks/reactPlayerPreview.75b4f0b92740dd8c.js",revision:"75b4f0b92740dd8c"},{url:"/_next/static/chunks/reactPlayerSoundCloud.e30839a0e42277aa.js",revision:"e30839a0e42277aa"},{url:"/_next/static/chunks/reactPlayerStreamable.5314ba8f0fa0aea7.js",revision:"5314ba8f0fa0aea7"},{url:"/_next/static/chunks/reactPlayerTwitch.057d7723095ca996.js",revision:"057d7723095ca996"},{url:"/_next/static/chunks/reactPlayerVidyard.9d3441c7d3c81cf8.js",revision:"9d3441c7d3c81cf8"},{url:"/_next/static/chunks/reactPlayerVimeo.b2b5d145ad48841c.js",revision:"b2b5d145ad48841c"},{url:"/_next/static/chunks/reactPlayerWistia.ca71bce5b493e90c.js",revision:"ca71bce5b493e90c"},{url:"/_next/static/chunks/reactPlayerYouTube.cc905c8b36f6b35d.js",revision:"cc905c8b36f6b35d"},{url:"/_next/static/chunks/webpack-609b09b99b84e024.js",revision:"tIAC7qZqKaStYMNLXlgC6"},{url:"/_next/static/css/1b5d19eeadf69a6f.css",revision:"1b5d19eeadf69a6f"},{url:"/_next/static/css/236f19f3b5c10498.css",revision:"236f19f3b5c10498"},{url:"/_next/static/css/549dea1c583a2ab9.css",revision:"549dea1c583a2ab9"},{url:"/_next/static/css/73925f0dd8c679e5.css",revision:"73925f0dd8c679e5"},{url:"/_next/static/css/c8cd8740b03f58fa.css",revision:"c8cd8740b03f58fa"},{url:"/_next/static/css/caff54392b6c182b.css",revision:"caff54392b6c182b"},{url:"/_next/static/css/eb2a18960373efb8.css",revision:"eb2a18960373efb8"},{url:"/_next/static/css/f869bdc8509050dd.css",revision:"f869bdc8509050dd"},{url:"/_next/static/media/11d2b8f36909f9f8-s.woff2",revision:"253d638a94e0c976c81f0e748453636c"},{url:"/_next/static/media/569ce4b8f30dc480-s.p.woff2",revision:"ef6cefb32024deac234e82f932a95cbd"},{url:"/_next/static/media/747892c23ea88013-s.woff2",revision:"a0761690ccf4441ace5cec893b82d4ab"},{url:"/_next/static/media/93f479601ee12b01-s.p.woff2",revision:"da83d5f06d825c5ae65b7cca706cb312"},{url:"/_next/static/media/a32b8555a329a916-s.woff2",revision:"49d1872ff799a516960ca922b9903ea7"},{url:"/_next/static/media/b7a0c831852102e3-s.woff2",revision:"860ae3ba75f6518ffbe0cc31093f1632"},{url:"/_next/static/media/ba015fad6dcf6784-s.woff2",revision:"8ea4f719af3312a055caf09f34c89a77"},{url:"/_next/static/media/c6d08e7617bbcdce-s.p.woff2",revision:"03838a05b4ed4dfca249c422e0ae4423"},{url:"/_next/static/media/golproLogoSvg.6e31832d.svg",revision:"e335874037c99dd142b973648883193d"},{url:"/_next/static/media/icon.5633ab49.svg",revision:"b63210b14eeda2ce6411f2dec8146f41"},{url:"/_next/static/media/notfoundsvg.2a59673e.svg",revision:"6bf4a052211c955c3cd970a7a70f7a41"},{url:"/_next/static/tIAC7qZqKaStYMNLXlgC6/_buildManifest.js",revision:"61944810b120b8e82864ab913306c007"},{url:"/_next/static/tIAC7qZqKaStYMNLXlgC6/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/default-profile.png",revision:"d7c4fbc755cf437ebad04223e632e580"},{url:"/file.svg",revision:"d09f95206c3fa0bb9bd9fefabfd0ea71"},{url:"/globe.svg",revision:"2aaafa6a49b6563925fe440891e32717"},{url:"/golproLogoSvg.svg",revision:"e335874037c99dd142b973648883193d"},{url:"/icons/apple-icon-180.png",revision:"1a2901e10c8cc5014a8bf65239f9878d"},{url:"/icons/apple-splash-1125-2436.jpg",revision:"7f4a60644de27bb721695cace92b224e"},{url:"/icons/apple-splash-1136-640.jpg",revision:"a42675d208a1e565a34f7a5eb914a497"},{url:"/icons/apple-splash-1170-2532.jpg",revision:"37e9991bed932294cbecabfc26649314"},{url:"/icons/apple-splash-1179-2556.jpg",revision:"a64e4190223bb303aca3761e78d8dfe0"},{url:"/icons/apple-splash-1206-2622.jpg",revision:"440eab3137f738bc6edbf51747468001"},{url:"/icons/apple-splash-1242-2208.jpg",revision:"d80b4b9bcafe3d612f133a185183aec4"},{url:"/icons/apple-splash-1242-2688.jpg",revision:"d7720f3a6bd6e8a28d6322417273a652"},{url:"/icons/apple-splash-1284-2778.jpg",revision:"e2f93fc34e16f95c8885ffb5648c27f7"},{url:"/icons/apple-splash-1290-2796.jpg",revision:"cdc6331dcd43fe7dc57a60a0122fd705"},{url:"/icons/apple-splash-1320-2868.jpg",revision:"d604e1b985df564c64afcff95d011b46"},{url:"/icons/apple-splash-1334-750.jpg",revision:"f07cc357ccb24dab027453bf7760280c"},{url:"/icons/apple-splash-1488-2266.jpg",revision:"bde7bc8126efb0aaebe08d4e9d542a4d"},{url:"/icons/apple-splash-1536-2048.jpg",revision:"9a9639dabd01a51dc2c17de33c891973"},{url:"/icons/apple-splash-1620-2160.jpg",revision:"c46edd387fd7db580be438d3aa8f0c48"},{url:"/icons/apple-splash-1640-2360.jpg",revision:"4c53511b44e366f5fbb3848e5f566420"},{url:"/icons/apple-splash-1668-2224.jpg",revision:"292b94f9c704c4cfed94460cae421df1"},{url:"/icons/apple-splash-1668-2388.jpg",revision:"a7410b10e09988e9b0eadb5f6f9f4cf5"},{url:"/icons/apple-splash-1792-828.jpg",revision:"3e3e6c1143716da3ee8fe0e145eccee2"},{url:"/icons/apple-splash-2048-1536.jpg",revision:"5044e27ae4b3979db336048358f325aa"},{url:"/icons/apple-splash-2048-2732.jpg",revision:"200d1024f32134efc9e20dfe7f0122d2"},{url:"/icons/apple-splash-2160-1620.jpg",revision:"01e213703a9488e36515c91edb8126dc"},{url:"/icons/apple-splash-2208-1242.jpg",revision:"15aa9b2b1922f0911edc984a97ee315d"},{url:"/icons/apple-splash-2224-1668.jpg",revision:"63fdea39377bb4e6bf1429bb56b50948"},{url:"/icons/apple-splash-2266-1488.jpg",revision:"3a989a459128a1459463ffd63aadf1fe"},{url:"/icons/apple-splash-2360-1640.jpg",revision:"0ab4b37f62b865576432a49d6886b31c"},{url:"/icons/apple-splash-2388-1668.jpg",revision:"2cb0ee3a690a60b3efd1116ef529d5e5"},{url:"/icons/apple-splash-2436-1125.jpg",revision:"e37c1a68c8c47a394941ace9cd214d97"},{url:"/icons/apple-splash-2532-1170.jpg",revision:"b9959d7a9d1c11dfa526dbc249486c09"},{url:"/icons/apple-splash-2556-1179.jpg",revision:"d1818c83287318eb6f34db8ac7059231"},{url:"/icons/apple-splash-2622-1206.jpg",revision:"054dd5e70f23733507d2c50fa01c3a3d"},{url:"/icons/apple-splash-2688-1242.jpg",revision:"4f2e20ef33861889c51bae018c28c276"},{url:"/icons/apple-splash-2732-2048.jpg",revision:"35da9240394af80b022321498fe07bc1"},{url:"/icons/apple-splash-2778-1284.jpg",revision:"9ee765a8f9c1a1dfd09c57285c9f26a4"},{url:"/icons/apple-splash-2796-1290.jpg",revision:"265192a6cb7f74058c3a5fd7f129dcb4"},{url:"/icons/apple-splash-2868-1320.jpg",revision:"05a28f9c5d3212e50d3f8b3a8a33e2bf"},{url:"/icons/apple-splash-640-1136.jpg",revision:"560a8496a598daebcec255f70439b63e"},{url:"/icons/apple-splash-750-1334.jpg",revision:"7325a6bf13a7deb3f46fe1b9057a55de"},{url:"/icons/apple-splash-828-1792.jpg",revision:"281b3ac68730043ea939dd971e974e87"},{url:"/icons/manifest-icon-192.maskable.png",revision:"4933e852f1f7b16dcec5d12eff234dbf"},{url:"/icons/manifest-icon-512.maskable.png",revision:"fcc66e370ab28f0f66904a138153d057"},{url:"/manifest.json",revision:"d0cbda48081b25d82f8f4cd046fa6f69"},{url:"/next.svg",revision:"8e061864f388b47f33a1c3780831193e"},{url:"/vercel.svg",revision:"c0af2f507b369b085b35ef4bbe3bcf1e"},{url:"/window.svg",revision:"a2760511c65806022ad20adf74370ff3"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:a,event:s,state:c})=>a&&"opaqueredirect"===a.type?new Response(a.body,{status:200,statusText:"OK",headers:a.headers}):a}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const a=e.pathname;return!a.startsWith("/api/auth/")&&!!a.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
