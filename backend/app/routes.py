from flask import Blueprint, request, jsonify
from app import db
from app.models import Analysis
from app.analyzer import PasswordAnalyzer
import csv
from io import StringIO
from datetime import datetime

api_bp = Blueprint('api', __name__)
analyzer = PasswordAnalyzer()

@api_bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'version': '1.0.0',
        'timestamp': datetime.utcnow().isoformat()
    })

@api_bp.route('/analyze', methods=['POST'])
def analyze_password():
    """Analyze single password"""
    
    data = request.get_json()
    password = data.get('password', '')
    
    if not password:
        return jsonify({'error': 'Password required'}), 400
    
    try:
        result = analyzer.analyze(password)
        
        # Save to database
        analysis = Analysis(
            password_length=result.get('password_length'),
            strength_score=result.get('strength_score'),
            entropy=result.get('entropy'),
            crack_time=result.get('crack_time')
        )
        analysis.set_components(result.get('components', []))
        analysis.set_issues(result.get('issues', []))
        analysis.set_suggestions(result.get('suggestions', []))
        
        db.session.add(analysis)
        db.session.commit()
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api_bp.route('/batch-analyze', methods=['POST'])
def batch_analyze():
    """Analyze multiple passwords from CSV"""
    
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    
    try:
        stream = StringIO(file.stream.read().decode("UTF8"), newline=None)
        reader = csv.DictReader(stream)
        
        results = []
        for row in reader:
            password = row.get('password', '')
            if password:
                result = analyzer.analyze(password)
                result['password_length'] = len(password)
                results.append(result)
        
        return jsonify({'analyses': results}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api_bp.route('/history', methods=['GET'])
def get_history():
    """Get analysis history"""
    limit = request.args.get('limit', 50, type=int)
    analyses = Analysis.query.order_by(
        Analysis.created_at.desc()
    ).limit(limit).all()
    
    return jsonify([a.to_dict() for a in analyses])

@api_bp.route('/stats', methods=['GET'])
def get_stats():
    """Get statistics"""
    total = Analysis.query.count()
    
    weak_count = Analysis.query.filter(
        Analysis.strength_score < 50
    ).count()
    
    strong_count = Analysis.query.filter(
        Analysis.strength_score >= 80
    ).count()
    
    avg_entropy = db.session.query(
        db.func.avg(Analysis.entropy)
    ).scalar() or 0
    
    return jsonify({
        'total_analyses': total,
        'weak_passwords': weak_count,
        'strong_passwords': strong_count,
        'average_entropy': round(avg_entropy, 2)
    })