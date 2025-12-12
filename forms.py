from flask_wtf import FlaskForm
from flask_wtf.file import FileField
from wtforms import StringField, TextAreaField, SubmitField, BooleanField, SelectField, PasswordField
from wtforms.validators import DataRequired

class BlogPostForm(FlaskForm):
    title = StringField('Titre', validators=[DataRequired()])
    content = TextAreaField('Contenu', validators=[DataRequired()])
    category = SelectField('Catégorie', coerce=int, validators=[DataRequired()])
    published = BooleanField('Publier immédiatement')
    media = FileField('Ajouter une image ou vidéo')
    submit = SubmitField('Publier')

class CommentForm(FlaskForm):
    content = TextAreaField('Commentaire', validators=[DataRequired()])
    submit = SubmitField('Poster')

class LoginForm(FlaskForm):
    username = StringField("Nom d'utilisateur", validators=[DataRequired()])
    password = PasswordField('Mot de passe', validators=[DataRequired()])
    submit   = SubmitField('Se connecter')