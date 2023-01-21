let user = new User('','','');

document.querySelector('#users-list').addEventListener('click', async (e)=>{
    e.preventDefault();
    // console.log(e.target);

    if(e.target.classList.contains('btn-delete')){
        let children = e.target.parentElement.parentElement.children;
        user.username = children[0].textContent;
        children[children.length - 1].textContent = 'Delete entry?';
        children[children.length - 1].appendChild(UI.button('Yes'));
        children[children.length - 1].appendChild(UI.button('No'));
    }

    if(e.target.classList.contains('btn-yes')){
        if(myCookie.getCookieByName('token')){
            await apiConnection.deleteUser(user.username).then(data => console.log(data));
            UI.confirmDelete(e.target);
            UI.showAlert(`User ${user.username} has been deleted succesfully`, 'success');
        }else{
            UI.showAlert(`Access token has expired! User ${user.username} has not been deleted!`,'danger');
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

        let children = e.target.parentNode.parentNode.children;
        console.log(children);
            // children[i].setAttribute('contenteditable','false');
            // children[i].classList.remove('td-edit');
        children[children.length - 1].textContent = '';
        children[children.length - 1].appendChild(UI.button('Delete'));
            // children[children.length - 1].appendChild(UI.button('Edit'));
            // console.log('works',children[children.length - 1]);
        UI.flagEdit = false;
    }

    if(e.target.classList.contains('btn-edit')){
        console.log('edit');
    }


})