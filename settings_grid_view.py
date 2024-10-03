from flask import Blueprint, render_template

settings_bp = Blueprint('settings', __name__)

@settings_bp.route('/settings')
def settings_grid():
    settings = [
        {'name': 'AI Settings', 'url': '/settings/ai'},
        {'name': 'Domain URL Defaults', 'url': '/settings/domain'},
        {'name': 'User Preferences', 'url': '/settings/preferences'},
        {'name': 'Notification Settings', 'url': '/settings/notifications'},
        {'name': 'Privacy Settings', 'url': '/settings/privacy'},
        {'name': 'API Configuration', 'url': '/settings/api'},
        {'name': 'Theme Settings', 'url': '/settings/theme'},
    ]
    return render_template('settings_grid.html', settings=settings)
