** Git flow **

- [] Fork repo from here: https://github.com/Jdgronewold/Walk-with-me
- [] git clone ```your new repo that you made```
- [] do all the normal git things (git add, commit, etc)
- [] git push to your server repo (the one you forked)
- [] make a git pull request, naming whoever you want to review it so the get a notification


More info here: https://gist.github.com/blackfalcon/8428401
and here: https://www.atlassian.com/git/tutorials/making-a-pull-request#example

Gmap key:
AIzaSyDUWVHvYA-psNWSTrpwIFlLM84soy3PxzA

Sample Firebase DB:

users
  - FBuserId
      - accessToken:
      - gender:
      - name:
      - rating: (future)
routes
  - routeId
      - start: lat/lng
      - end: lat/lng
      - authorId: (FB userId)
      - authorName: (FB name)
matchedRoutes
  - matchedRouteId (different from both constituent routes!)
      - author
          - FB userId
          - routeId
      - matcher
          - FB userId
          - routeId
