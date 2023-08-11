const createToken = (user) => {
    return {
        username : user.username,
        userId : user._id,
        role : user.role,
        email : user.email,
        avatar : user.avatar,
        avatarUrl : user.avatar,
    }
}

module.exports = createToken