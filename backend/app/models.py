from app import db
from datetime import datetime
import json

class Analysis(db.Model):
    """Store password analysis results"""
    __tablename__ = 'analyses'
    
    id = db.Column(db.Integer, primary_key=True)
    password_length = db.Column(db.Integer)
    strength_score = db.Column(db.Float, default=0)
    entropy = db.Column(db.Float, default=0)
    crack_time = db.Column(db.String(255))
    components_json = db.Column(db.Text)
    issues_json = db.Column(db.Text)
    suggestions_json = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def set_components(self, components):
        self.components_json = json.dumps(components)
    
    def get_components(self):
        if self.components_json:
            return json.loads(self.components_json)
        return []
    
    def set_issues(self, issues):
        self.issues_json = json.dumps(issues)
    
    def get_issues(self):
        if self.issues_json:
            return json.loads(self.issues_json)
        return []
    
    def set_suggestions(self, suggestions):
        self.suggestions_json = json.dumps(suggestions)
    
    def get_suggestions(self):
        if self.suggestions_json:
            return json.loads(self.suggestions_json)
        return []
    
    def to_dict(self):
        return {
            'id': self.id,
            'password_length': self.password_length,
            'strength_score': self.strength_score,
            'entropy': self.entropy,
            'crack_time': self.crack_time,
            'components': self.get_components(),
            'issues': self.get_issues(),
            'suggestions': self.get_suggestions(),
            'timestamp': self.created_at.isoformat()
        }