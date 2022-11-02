curl -F grant_type=authorization_code \
-F client_id=13048d1985df54479741344156321e0b0d101970ad8c152c72f3de8c508c00a2 \
-F client_secret=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 \
-F code=51b3ffd748d3b3a274247ea8a2e8ed2a387c91120208701c7d0eed4f4cb92854 \
-F redirect_uri=https://42tokyo.jp \
-X POST https://api.intra.42.fr/oauth/token | jq
