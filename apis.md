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
    -POST /request/send/:status/:userID
    -POST /request/review/:status/:requestID


## userRouter
    -GET /user/connections
    -GET /user/requests
    -GET /user/feed

## adminRouter
    -DELETE /admin/deleteUser    
    -DELETE /admin/deleteAll


