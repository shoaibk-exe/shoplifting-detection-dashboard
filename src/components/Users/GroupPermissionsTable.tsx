import { useEffect, useState } from "react";

interface Permission {
    moduleName: string;
    view: boolean;
    add: boolean;
    edit: boolean;
    delete: boolean;
}

const modules = [
    'Chemical',
    'Purchase',
    'Purchase Payment',
    'Expense',
    'Quotation',
    'Employee',
    'User',
    'Supplier',
    'Biller',
];

const GroupPermissionsTable = () => {
    const [selectAll, setSelectAll] = useState(false);
    const [permissions, setPermissions] = useState<Permission[]>(
        modules.map(module => ({
            moduleName: module,
            view: false,
            add: false,
            edit: false,
            delete: false,
        })),
    );

    const handlePermissionChange = (
        index: number,
        permissionType: keyof Permission,
    ) => {
        const updatedPermissions = [...permissions];
        updatedPermissions[index][permissionType] =
            !updatedPermissions[index][permissionType];
        setPermissions(updatedPermissions);
    };

    const handleSelectAllChange = () => {
        const newValue = !selectAll;
        setSelectAll(newValue);
        const updatedPermissions = permissions.map(permission => ({
            ...permission,
            view: newValue,
            add: newValue,
            edit: newValue,
            delete: newValue,
        }));
        setPermissions(updatedPermissions);
    };
    useEffect(() => {
        console.log(permissions)
    }, [permissions])
    return (
        <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
            <div className="grid grid-cols-12 items-center px-4 py-6 md:px-6 xl:px-9">
                <h4 className="col-span-4 text-body-2xlg font-bold text-dark dark:text-white">
                    Admin Group Permission
                </h4>
                <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAllChange}
                    className="col-span-2 px-4 py-4.5"
                />
            </div>
            <table className="w-full table-auto border-collapse">
                <thead className="px-4 py-6 md:px-6 xl:px-9">
                    <tr className="grid grid-cols-12 border-t border-stroke dark:border-dark-3">
                        <th className="col-span-4 ml-4 px-4 py-4.5 text-left font-medium text-dark dark:text-white">
                            Module Name
                        </th>
                        <th className="col-span-2 px-4 py-4.5 text-center font-medium text-dark dark:text-white">
                            View
                        </th>
                        <th className="col-span-2 px-4 py-4.5 text-center font-medium text-dark dark:text-white">
                            Add
                        </th>
                        <th className="col-span-2 px-4 py-4.5 text-center font-medium text-dark dark:text-white">
                            Edit
                        </th>
                        <th className="col-span-2 px-4 py-4.5 text-center font-medium text-dark dark:text-white">
                            Delete
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {permissions.map((permission, index) => (
                        <tr
                            className="grid grid-cols-12 border-t border-stroke dark:border-dark-3"
                            key={index}
                        >
                            <td className="col-span-4 px-4 py-4.5 text-left">
                                <div className="flex items-center">
                                    <p className="ml-4 text-body-sm font-medium text-dark dark:text-dark-6">
                                        {permission.moduleName}
                                    </p>
                                </div>
                            </td>
                            <td className="col-span-2 px-4 py-4.5 text-center">
                                <input
                                    type="checkbox"
                                    checked={permission.view}
                                    onChange={() => handlePermissionChange(index, 'view')}
                                />
                            </td>
                            <td className="col-span-2 px-4 py-4.5 text-center">
                                <input
                                    type="checkbox"
                                    checked={permission.add}
                                    onChange={() => handlePermissionChange(index, 'add')}
                                />
                            </td>
                            <td className="col-span-2 px-4 py-4.5 text-center">
                                <input
                                    type="checkbox"
                                    checked={permission.edit}
                                    onChange={() => handlePermissionChange(index, 'edit')}
                                />
                            </td>
                            <td className="col-span-2 px-4 py-4.5 text-center">
                                <input
                                    type="checkbox"
                                    checked={permission.delete}
                                    onChange={() => handlePermissionChange(index, 'delete')}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
