curl -F grant_type=authorization_code \
-F client_id=13048d1985df54479741344156321e0b0d101970ad8c152c72f3de8c508c00a2 \
-F client_secret=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 \
-F code=1ec9adee482186608f021b228241cc847b86a3fcd175075ebc3752c27a9559fd \
-F redirect_uri=https://42tokyo.jp \
-X POST https://api.intra.42.fr/oauth/token | jq
