import re
import math
from datetime import datetime

class PasswordAnalyzer:
    """Analyze password strength"""
    
    def __init__(self):
        self.issues = []
        self.components = []
        self.suggestions = []
    
    def analyze(self, password):
        """Main analysis method"""
        # Reset
        self.issues = []
        self.components = []
        self.suggestions = []
        
        if not password:
            return {
                'error': 'Password cannot be empty',
                'strength_score': 0
            }
        
        # Run checks
        self._check_length(password)
        self._check_complexity(password)
        self._check_patterns(password)
        self._check_dictionary_words(password)
        self._check_keyboard_patterns(password)
        
        # Calculate metrics
        entropy = self._calculate_entropy(password)
        strength_score = self._calculate_score()
        crack_time = self._estimate_crack_time(entropy)
        
        return {
            'password_length': len(password),
            'strength_score': round(strength_score, 1),
            'entropy': round(entropy, 2),
            'crack_time': crack_time,
            'strength_rating': self._get_rating(strength_score),
            'components': self.components,
            'issues': self.issues,
            'suggestions': self.suggestions
        }
    
    def _check_length(self, password):
        """Check password length"""
        length = len(password)
        
        if length < 6:
            self.issues.append({
                'type': 'critical',
                'message': 'Too short (less than 6 characters)'
            })
            self.suggestions.append('Use at least 12 characters')
        elif length < 8:
            self.issues.append({
                'type': 'high',
                'message': 'Short (8 characters recommended)'
            })
        elif length < 12:
            self.issues.append({
                'type': 'medium',
                'message': 'Acceptable but 12+ recommended'
            })
        elif length >= 16:
            self.components.append('Excellent length (16+ characters)')
        elif length >= 12:
            self.components.append('Good length (12+ characters)')
        else:
            self.components.append('Acceptable length')
    
    def _check_complexity(self, password):
        """Check character diversity"""
        has_lower = bool(re.search(r'[a-z]', password))
        has_upper = bool(re.search(r'[A-Z]', password))
        has_digit = bool(re.search(r'\d', password))
        has_special = bool(re.search(r'[!@#$%^&*()_\-+=\[\]{};:\'",.<>?/\\|`~]', password))
        
        if has_lower:
            self.components.append('Lowercase letters')
        if has_upper:
            self.components.append('Uppercase letters')
        if has_digit:
            self.components.append('Numbers')
        if has_special:
            self.components.append('Special characters')
        
        complexity = sum([has_lower, has_upper, has_digit, has_special])
        
        if complexity < 2:
            self.issues.append({
                'type': 'critical',
                'message': 'Low character variety'
            })
            self.suggestions.append('Mix uppercase, lowercase, numbers, and symbols')
        elif complexity < 3:
            self.issues.append({
                'type': 'high',
                'message': 'Limited character variety'
            })
            self.suggestions.append('Add more character types')
        elif complexity == 4:
            self.components.append('All character types present')
    
    def _check_patterns(self, password):
        """Check for weak patterns"""
        # Sequential characters
        if re.search(r'(?:abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)', password.lower()):
            self.issues.append({
                'type': 'high',
                'message': 'Contains sequential letters'
            })
        
        # Sequential numbers
        if re.search(r'(?:012|123|234|345|456|567|678|789|890)', password):
            self.issues.append({
                'type': 'high',
                'message': 'Contains sequential numbers'
            })
        
        # Repeated characters
        if re.search(r'(.)\1{2,}', password):
            self.issues.append({
                'type': 'medium',
                'message': 'Contains repeated characters'
            })
            self.suggestions.append('Avoid repeating characters (aaa, 111)')
    
    def _check_keyboard_patterns(self, password):
        """Check for keyboard patterns"""
        patterns = [
            r'qwerty',
            r'asdfgh',
            r'zxcvbn',
            r'qazwsx',
            r'1qaz',
            r'qwe',
            r'asd',
            r'zxc'
        ]
        
        for pattern in patterns:
            if re.search(pattern, password.lower()):
                self.issues.append({
                    'type': 'high',
                    'message': 'Contains keyboard pattern'
                })
                break
    
    def _check_dictionary_words(self, password):
        """Check for common dictionary words"""
        common_words = [
            'password', 'pass', 'admin', 'user', 'root', 'welcome',
            'qwerty', 'dragon', 'master', 'monkey', 'abc123', '123456'
        ]
        
        password_lower = password.lower()
        found_words = []
        
        for word in common_words:
            if word in password_lower:
                found_words.append(word)
        
        if found_words:
            self.issues.append({
                'type': 'high',
                'message': f'Contains dictionary words: {", ".join(found_words)}'
            })
            self.suggestions.append('Avoid using common words or phrases')
    
    def _calculate_entropy(self, password):
        """Calculate Shannon entropy"""
        charset_size = 0
        
        if re.search(r'[a-z]', password):
            charset_size += 26
        if re.search(r'[A-Z]', password):
            charset_size += 26
        if re.search(r'\d', password):
            charset_size += 10
        if re.search(r'[!@#$%^&*()_\-+=\[\]{};:\'",.<>?/\\|`~]', password):
            charset_size += 32
        
        if charset_size == 0:
            return 0
        
        entropy = len(password) * math.log2(charset_size)
        return entropy
    
    def _calculate_score(self):
        """Calculate overall strength score"""
        score = 50  # Base score
        
        # Add points for components
        score += len(self.components) * 10
        
        # Subtract points for issues
        for issue in self.issues:
            if issue['type'] == 'critical':
                score -= 15
            elif issue['type'] == 'high':
                score -= 10
            elif issue['type'] == 'medium':
                score -= 5
        
        return max(0, min(100, score))
    
    def _estimate_crack_time(self, entropy):
        """Estimate time to crack via brute force"""
        attempts_per_second = 1_000_000_000  # 1 billion
        total_attempts = 2 ** entropy
        seconds_needed = total_attempts / (2 * attempts_per_second)
        
        if seconds_needed < 1:
            return 'Less than 1 second'
        elif seconds_needed < 60:
            return f'{int(seconds_needed)} seconds'
        elif seconds_needed < 3600:
            return f'{int(seconds_needed/60)} minutes'
        elif seconds_needed < 86400:
            return f'{int(seconds_needed/3600)} hours'
        elif seconds_needed < 86400 * 365:
            return f'{int(seconds_needed/86400)} days'
        elif seconds_needed < 86400 * 365 * 100:
            return f'{int(seconds_needed/(86400*365))} years'
        else:
            return 'Millions of years'
    
    def _get_rating(self, score):
        """Get strength rating"""
        if score >= 90:
            return 'Very Strong'
        elif score >= 70:
            return 'Strong'
        elif score >= 50:
            return 'Moderate'
        elif score >= 25:
            return 'Weak'
        else:
            return 'Very Weak'