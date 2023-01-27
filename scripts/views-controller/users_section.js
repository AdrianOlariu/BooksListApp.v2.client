// let user = new User('','','');

document.querySelector('#users-list').addEventListener('click', async (e)=>{
    e.preventDefault();
    // console.log(e.target);

    if(e.target.classList.contains('btn-edit')){
        // console.log('edit');
        if(!UI.flagEdit){
            UI.editUser(e.target);
        }
    }

    if(e.target.classList.contains('btn-save')){
        console.log('BUTTON SAVE');
        const updateUser = UI.saveEditUser(e.target);
        console.log(updateUser);
        if(updateUser !== null){
            if(myCookie.getCookieByName('token')){
                const result = await apiConnection.updateUser(updateUser);
                if(result){
                    UI.showAlert(`User ${updateUser.username} has been updated succesfully`, 'success', 3000);
                }
            }else{
                UI.showAlert(`Access token has expired! User ${updateUser.username} has not been updated!`,'warning',3000);
            }
        }else{
            UI.showAlert(`No fields were updated!`,'info',3000);
        }
        
    }

    if(e.target.classList.contains('btn-delete')){
        UI.deleteUser(e.target);
        username = UI.holdUser.username;
    }

    if(e.target.classList.contains('btn-yes')){
        if(myCookie.getCookieByName('token')){
            await apiConnection.deleteUser(username).then(data => console.log(data));
            UI.confirmDelete(e.target);
            UI.showAlert(`User ${username} has been deleted succesfully`, 'success');
        }else{
            UI.showAlert(`Access token has expired! User ${username} has not been deleted!`,'danger');
            UI.animationHeader('When the access token expires, refresh it by clicking the book icon!', 0, 1);
            let children = e.target.parentNode.parentNode.children;
            console.log(children);
            children[children.length - 1].textContent = '';
            children[children.length - 1].appendChild(UI.button('Delete'));
        }
    }

    if(e.target.classList.contains('btn-cancel') || e.target.classList.contains('btn-no')){
        // console.log('cancel');
        // UI.cancelEdit(e.target);
        UI.cancelEditUser(e.target);
    }

    if(e.target.classList.contains('btn-edit')){
        console.log('edit');
    }


})