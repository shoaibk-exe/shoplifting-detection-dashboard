
export const AccessScopes = {
    Roles: ["Read", "Add", "Edit", "Delete"],
    Users: ["Read", "Add", "Edit", "Delete"],
    ManagedDevice: ["Read", "Add", "Edit", "Delete"],

}
export const Access_Scope = {
    Role: {
        Read: "Read_Roles",
        Add: "Add_Roles",
        Edit: "Edit_Roles",
        Delete: "Delete_Roles"
    },
    Users: {
        Read: "Read_Users",
        Add: "Add_Users",
        Edit: "Edit_Users",
        Delete: "Delete_Users"
    },
    ManagedDevice: {
        Read: "Read_ManagedDevice",
        Add: "Add_ManagedDevice",
        Edit: "Edit_ManagedDevice",
        Delete: "Delete_ManagedDevice"
    }
}
export const renderingComp = {
    Roles: {
        Edit: "EDIT_MODAL",
    },
    Users: {
        Edit: "EDIT_USER",
    },
    Cameras: {
        Edit: "EDIT_CAMERA",
    },
}