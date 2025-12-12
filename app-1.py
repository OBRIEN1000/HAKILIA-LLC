from flask import Flask, render_template, redirect, url_for, request, flash, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, login_user, login_required, UserMixin, current_user, logout_user
from flask_wtf.csrf import CSRFProtect
from werkzeug.utils import secure_filename
import os
from datetime import datetime
from forms import BlogPostForm, CommentForm, LoginForm
from models import db, User, BlogPost, Comment, Category

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///blog.sqlite'
app.config['UPLOAD_FOLDER'] = os.path.join('static', 'img')
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg', 'gif', 'mp4'}

db.init_app(app)
csrf = CSRFProtect(app)

login_manager = LoginManager(app)
login_manager.login_view = 'login'

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

def create_tables():
    db.create_all()
    if User.query.first() is None:
        admin = User(username='admin', password_hash='admin')
        db.session.add(admin)
        db.session.commit()
    if Category.query.first() is None:
        categories = ['Technologie', 'Lifestyle', 'Cuisine', 'Voyage']
        for cat in categories:
            db.session.add(Category(name=cat))
        db.session.commit()
    if BlogPost.query.first() is None:
        sample_posts = [
            BlogPost(title="Découverte de Flask", content="Un framework génial pour Python.", category_id=1, published=True, author_id=1),
            BlogPost(title="Voyage à Paris", content="Une ville magnifique !", category_id=4, published=True, author_id=1)
        ]
        for post in sample_posts:
            db.session.add(post)
        db.session.commit()
with app.app_context():
    create_tables()


@app.route('/hakilia_blog')
def hakilia_blog():
    posts = BlogPost.query.filter_by(published=True).order_by(BlogPost.created_at.desc()).limit(3).all()
    return render_template('hakilia-hakilia.html', posts=posts)

@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        username = form.username.data
        password = form.password.data
        user = User.query.filter_by(username=username).first()
        if user and user.password_hash == password:
            login_user(user)
            flash("Connexion réussie!", "success")
            return redirect(url_for('dashboard'))
        flash("Nom d’utilisateur ou mot de passe invalide.", "danger")
    return render_template('login.html', form= form)

@app.route('/dashboard')
@login_required
def dashboard():
    posts = BlogPost.query.all()
    return render_template('dashboard.html', posts=posts)

@app.route('/stats')
@login_required
def stats():
    total_posts = BlogPost.query.count()
    total_views = sum(post.views for post in BlogPost.query.all())
    total_likes = sum(post.likes for post in BlogPost.query.all())
    total_comments = Comment.query.count()
    posts_by_category = db.session.query(Category.name, db.func.count(BlogPost.id)).join(BlogPost).group_by(Category.id).all()
    return render_template('stats.html', total_posts=total_posts, total_views=total_views, total_likes=total_likes, total_comments=total_comments, posts_by_category=posts_by_category)

@app.route('/add-post', methods=['GET', 'POST'])
@login_required
def add_post():
    form = BlogPostForm()
    form.category.choices = [(cat.id, cat.name) for cat in Category.query.all()]
    if form.validate_on_submit():
        new_post = BlogPost(
            title=form.title.data,
            content=form.content.data,
            category_id=form.category.data,
            published=form.published.data,
            author_id=current_user.id
        )
        if form.media.data:
            file = form.media.data
            if allowed_file(file.filename):
                filename = secure_filename(file.filename)
                file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
                new_post.media_path = filename
        db.session.add(new_post)
        db.session.commit()
        flash("Article ajouté avec succès !", "success")
        return redirect(url_for('dashboard'))
        print(form.content.data)
    return render_template('add_post.html', form=form)


@app.route('/edit-post/<int:post_id>', methods=['GET', 'POST'])
@login_required
def edit_post(post_id):
    post = BlogPost.query.get_or_404(post_id)
    form = BlogPostForm(obj=post)
    form.category.choices = [(cat.id, cat.name) for cat in Category.query.all()]
    if form.validate_on_submit():
        post.title = form.title.data
        post.content = form.content.data
        post.category_id = form.category.data
        post.published = form.published.data
        if form.media.data:
            file = form.media.data
            if allowed_file(file.filename):
                filename = secure_filename(file.filename)
                file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
                post.media_path = filename
        db.session.commit()
        flash("Article mis à jour avec succès !", "success")
        return redirect(url_for('dashboard'))
    return render_template('edit_post.html', form=form, post=post)

@app.route('/delete-post/<int:post_id>')
@login_required
def delete_post(post_id):
    post = BlogPost.query.get_or_404(post_id)
    db.session.delete(post)
    db.session.commit()
    flash("Article supprimé avec succès !", "success")
    return redirect(url_for('dashboard'))

@app.route('/blog')
def blog():
    posts = BlogPost.query.filter_by(published=True).order_by(BlogPost.created_at.desc()).all()
    return render_template('blog.html', posts=posts)

@app.route('/post/<int:post_id>', methods=['GET', 'POST'])
def post_detail(post_id):
    post = BlogPost.query.get_or_404(post_id)
    if post.published or (current_user.is_authenticated and current_user.id == post.author_id):
        post.views += 1
        db.session.commit()
        form = CommentForm()
        if form.validate_on_submit():
            comment = Comment(content=form.content.data, post_id=post.id)
            db.session.add(comment)
            db.session.commit()
            flash("Commentaire ajouté !", "success")
            return redirect(url_for('post_detail', post_id=post.id))
        comments = Comment.query.filter_by(post_id=post.id).all()
        return render_template('post_detail.html', post=post, comments=comments, form=form)
    return redirect(url_for('blog'))

@app.route('/like/<int:post_id>')
def like_post(post_id):
    post = BlogPost.query.get_or_404(post_id)
    post.likes += 1
    db.session.commit()
    return jsonify({'likes': post.likes})

@app.route('/delete-comment/<int:comment_id>')
@login_required
def delete_comment(comment_id):
    comment = Comment.query.get_or_404(comment_id)
    db.session.delete(comment)
    db.session.commit()
    flash("Commentaire supprimé avec succès !", "success")
    return redirect(request.referrer or url_for('dashboard', post_id=comment.post_id))

@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash("Déconnexion réussie.", "success")
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True)