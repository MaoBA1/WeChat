const mongoose = require('mongoose');
const Post = require('../models/Posts');
const Account = require('../models/Account');



const recive_all_post = (io) => {
    Post.find({})
    .then(posts => {
        return io.emit("recive_all_post", {posts: posts.sort((a, b) => (new Date(b.creatAdt) - new Date(a.creatAdt)))});
    })
}

const recive_all_account_posts = async(socket, accountId) => {
    Post.find({'postAuthor._id': accountId}).lean()
    .then(posts => {
        posts.sort((a, b) => (new Date(b.creatAdt) - new Date(a.creatAdt)));
        return socket.emit("recive_all_account_posts", {posts: posts});
    })
}


const postEvents = (io, socket) => {
    
    socket.on("recive_all_post", (data) => {
        recive_all_post(io);
    })

    socket.on("recive_all_account_posts", (data) => {
        const { accountId } = data;
        recive_all_account_posts(socket, accountId);
    })

    socket.on("create_post", (data) => {
        const {
            postAuthor,
            postContent,
            postMedia
        } = data;
        const new_post = new Post({
            _id: mongoose.Types.ObjectId(),
            postAuthor: postAuthor,
            postContent: postContent,
            postMedia: postMedia
        })
        return new_post.save()
        .then(() => {
            recive_all_post(io);
        })
        .catch(error => {
            console.log(error.message);
        })
    })


    socket.on("give_like_to_post", (data) => {
        const {
            postId,
            account,
            accountFriends
        } = data;

        Post.findById(postId)
        .then(post => {
            if(post) {
                post.likes.push(account);
                return post.save()
                .then((post) => {
                    // if(post.postAuthor._id.toString() === account) {
                    //     recive_all_account_posts(socket, account);
                    //     recive_all_friends_posts(io, accountFriends);
                    //     return;
                    // }          
                    // recive_all_friends_posts(io, accountFriends); 
                    recive_all_post(io);         
                })                
            }
        })
        .catch(error => {
            console.log(error.message);
        })
    })

    socket.on("unlike_post", (data) => {
        const {
            postId,
            account,
            accountFriends
        } = data;
        
        Post.findById(postId)
        .then(post => {
            if(post) {
                post.likes = post.likes.filter(l => l._id.toString() !== account.toString());
                return post.save()
                .then((post) => {
                    // if(post.postAuthor._id.toString() === account) {
                    //     recive_all_account_posts(socket, account);
                    //     recive_all_friends_posts(io, accountFriends);
                    //     return;
                    // }          
                    // recive_all_friends_posts(io, accountFriends); 
                    recive_all_post(io);         
                }) 
            }
        })
        .catch(error => {
            console.log(error.message);
        })
    })

    socket.on("add_comment_to_post", (data) => {
        const {
            postId,
            comment,
            account,
            accountFriends
        } = data;

        Post.findById(postId)
        .then(post => {
            if(post) {
                post.comments.push({
                    comment: comment,
                    commentAuthor: {
                        _id: account._id,
                        email: account.email,
                        fname: account.fname,
                        lname: account.lname,
                        profileImage: account.profileImage
                    }
                });
                return post.save()
                .then(updated_post => {
                    Post.find({})
                    .then((posts) => {
                        // if(post.postAuthor._id.toString() === account._id) {
                        //     recive_all_account_posts(socket, account._id);
                        // }          
                        // recive_all_friends_posts(io, accountFriends);
                        // io.emit("get_updated_post", {updated_post: updated_post});
                        io.emit("get_updated_post", {updated_post: updated_post});
                        recive_all_post(io);
                    }) 
                })
            }
        })
        .catch(error => {
            console.log(error.message);
        })
    })
}


module.exports = {
    postEvents,
    recive_all_post,
};