import "./settings.css";
import { Back } from "iconsax-react";
import UserCard from "./userCard/userCard";
import UserEditForm from "./userEditForm/userEditForm";
import { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

const Settings = ({ handleGoBack, userID }) => {
    const [editedUserId, setEditedUserId] = useState(null);
    const [users, setUsers] = useState([]);
    const [deletedUserId, setDeletedUserId] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [renderIndex, setRenderIndex] = useState(0);

    useEffect(() => {
        fetch("http://localhost:3010/users")
            .then((response) => response.json())
            .then((data) => {
                setUsers(data);
            })
            .catch((error) => console.error(error));
    }, [deletedUserId, editedUserId]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setRenderIndex((prevIndex) => prevIndex + 1);
        }, 500);

        return () => {
            clearTimeout(timer);
        };
    }, [renderIndex]);

    const handleShowAddForm = () => {
        setShowAddForm(true);
    };

    const handleCloseAddForm = () => {
        setShowAddForm(false);
    };

    const handleEditUser = (userID) => {
        setEditedUserId(userID);
    };

    const handleCloseEditForm = () => {
        editedUserId && setEditedUserId(null);
    };

    const handleDeleteUser = (userID) => {
        fetch(`http://localhost:3010/users/${userID}`, {
            method: "DELETE",
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Błąd podczas usuwania użytkownika");
                }
                console.log("Użytkownik został pomyślnie usunięty");
                setDeletedUserId(userID);
            })
            .catch((error) => {
                console.error("Błąd:", error);
            });
    };

    const handleEscKey = (event) => {
        if (event.keyCode === 27) {
            handleCloseAddForm();
            handleCloseEditForm();
        }
    };

    useEffect(() => {
        document.addEventListener("keydown", handleEscKey);

        return () => {
            document.removeEventListener("keydown", handleEscKey);
        };
    }, [editedUserId]);

    return (
        <>
            <ToastContainer />
            {showAddForm && <UserEditForm handleClose={handleCloseAddForm} />}

            <div className='settings-topbar'>
                <div className='settings-topbar-text'>Ustawienia</div>
                <div className='settings-topbar-buttons'>
                    <button
                        className='settings-topbar-buttons-adduser'
                        type='button'
                        onClick={() => handleShowAddForm()}
                    >
                        Dodaj użytkownika
                    </button>
                    <button
                        className='settings-topbar-buttons-back'
                        type='button'
                        onClick={() => handleGoBack()}
                    >
                        <Back />
                    </button>
                </div>
            </div>

            <div className='settings-content'>
                {users.slice(0, renderIndex).map((user, index) => (
                    <div  key={index}>
                        <UserCard
                            login={user.login}
                            role={user.role}
                            id={user.id}
                            self={userID === user.id ? true : false}
                            handleEdit={handleEditUser}
                            handleDelete={handleDeleteUser}
                            handleClose={handleCloseEditForm}
                        />
                        {editedUserId === user.id && (
                            <UserEditForm
                                userID={user.id}
                                role={user.role}
                                handleClose={handleCloseEditForm}
                            />
                        )}
                    </div>
                ))}
            </div>
        </>
    );
};

export default Settings;
