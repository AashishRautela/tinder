module.exports.getFullName = (user) => {
    if (!user) {
        return "";
    }
    const firstName = user?.firstName || "";
    const lastName = user?.lastName || "";

    return firstName + " " + lastName;
};
