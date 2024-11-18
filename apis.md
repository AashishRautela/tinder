# API LIST

## authRouter
    -POST /signUp
    -POST /logIn
    -POST /logOut


## profileRouter
    -GET /profile
    -PATCh /profile/edit
    -PATCH /profile/updatePassword
    -DELETE /profile/delete


## connectionRequestRouter
    -POST /request/send/interested:userID
    -POST /request/send/ignored:userID
    -POST /request/review/accepted:requestID
    -POST /request/review/rejected:requestID


## userRouter
    -GET /user/connections
    -GET /user/requests
    -GET /user/feed

## adminRouter
    -DELETE /admin/deleteUser    
    -DELETE /admin/deleteAll


