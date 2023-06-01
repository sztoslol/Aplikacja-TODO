import "./userCard.css";
import { Trash, Edit2 } from "iconsax-react";

const UserCard = ({
    id,
    login,
    role,
    self,
    handleEdit,
    handleDelete,
    handleClose,
}) => {
    const onDelete = () => {
        handleDelete(id);
    };

    return (
        <div className='userCard-main animate__animated animate__fadeInUp'>
            <div className='userCard-login'>
                {login}
                {self && "(ty)"}
            </div>
            <div className='userCard-mid'>
                <div className='userCard-role'>
                    <div className='userCard-role-dot'></div>
                    <div className='userCard-role-name'>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                    </div>
                </div>
                <div className='userCard-buttons'>
                    <div
                        className='userCard-buttons-delete'
                        onClick={() => onDelete()}
                    >
                        {!self && <Trash variant='Bold' />}
                    </div>
                    <div
                        className='userCard-buttons-edit'
                        onClick={() => {
                            handleEdit(id);
                            handleClose();
                        }}
                    >
                        <Edit2 variant='Bold' />
                    </div>
                </div>
            </div>
            <div className='userCard-bottom'></div>
        </div>
    );
};

export default UserCard;
