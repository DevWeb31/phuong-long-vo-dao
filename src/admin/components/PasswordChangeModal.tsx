import React, { useState } from 'react';
import { Eye, EyeOff, Lock, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

interface PasswordChangeModalProps {
  isOpen: boolean;
  onUpdatePassword: (newPassword: string) => Promise<void>;
  onDismiss: () => void;
  isFirstLogin?: boolean; // Pour différencier première connexion vs changement volontaire
}

const PasswordChangeModal: React.FC<PasswordChangeModalProps> = ({
  isOpen,
  onUpdatePassword,
  onDismiss,
  isFirstLogin = false
}) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    if (password.length < 8) {
      errors.push('Au moins 8 caractères');
    }
    if (password.length > 50) {
      errors.push('Maximum 50 caractères');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Au moins une majuscule');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Au moins une minuscule');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Au moins un chiffre');
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Au moins un caractère spécial');
    }
    return errors;
  };

  // Fonction pour vérifier chaque critère individuellement
  const checkPasswordCriteria = (password: string) => {
    return {
      length: password.length >= 8 && password.length <= 50,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    const errors = validatePassword(newPassword);
    if (errors.length > 0) {
      toast.error(`Mot de passe invalide: ${errors.join(', ')}`);
      return;
    }

    setLoading(true);
    try {
      await onUpdatePassword(newPassword);
      toast.success('Mot de passe mis à jour avec succès');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error(error);
      toast.error('Erreur lors de la mise à jour du mot de passe');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const newPasswordErrors = newPassword ? validatePassword(newPassword) : [];
  const passwordsMatch = newPassword && confirmPassword && newPassword === confirmPassword;
  const criteria = checkPasswordCriteria(newPassword);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-white/20 rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-yellow-500/20 rounded-lg">
            <Lock className="w-6 h-6 text-yellow-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">
              {isFirstLogin ? 'Configuration de votre mot de passe' : 'Changement de mot de passe'}
            </h3>
            <p className="text-white/70">
              {isFirstLogin 
                ? 'Pour votre première connexion, vous devez définir un mot de passe sécurisé'
                : 'Pour des raisons de sécurité, vous devez définir un nouveau mot de passe'
              }
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nouveau mot de passe */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">
              Nouveau mot de passe *
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="admin-input pr-10"
                placeholder="Minimum 8 caractères"
                required
                minLength={8}
                maxLength={50}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <EyeOff className="h-5 w-5 text-white/60" />
                ) : (
                  <Eye className="h-5 w-5 text-white/60" />
                )}
              </button>
            </div>
            {newPassword && newPasswordErrors.length > 0 && (
              <div className="mt-1 text-xs text-red-400">
                {newPasswordErrors.join(', ')}
              </div>
            )}
            {newPassword && newPasswordErrors.length === 0 && (
              <div className="mt-1 text-xs text-green-400">
                ✓ Mot de passe valide
              </div>
            )}
          </div>

          {/* Confirmation du mot de passe */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">
              Confirmer le mot de passe *
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="admin-input pr-10"
                placeholder="Répétez le mot de passe"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5 text-white/60" />
                ) : (
                  <Eye className="h-5 w-5 text-white/60" />
                )}
              </button>
            </div>
            {confirmPassword && passwordsMatch && (
              <div className="mt-1 text-xs text-green-400">
                ✓ Les mots de passe correspondent
              </div>
            )}
            {confirmPassword && !passwordsMatch && (
              <div className="mt-1 text-xs text-red-400">
                ✗ Les mots de passe ne correspondent pas
              </div>
            )}
          </div>

          {/* Exigences du mot de passe */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="text-blue-400 font-medium">Exigences du mot de passe</p>
                <ul className="mt-1 space-y-1">
                  <li className={`flex items-center space-x-2 ${criteria.length ? 'text-green-400' : 'text-blue-300'}`}>
                    <span>{criteria.length ? '✓' : '•'}</span>
                    <span>8 à 50 caractères</span>
                  </li>
                  <li className={`flex items-center space-x-2 ${criteria.uppercase ? 'text-green-400' : 'text-blue-300'}`}>
                    <span>{criteria.uppercase ? '✓' : '•'}</span>
                    <span>Au moins une majuscule</span>
                  </li>
                  <li className={`flex items-center space-x-2 ${criteria.lowercase ? 'text-green-400' : 'text-blue-300'}`}>
                    <span>{criteria.lowercase ? '✓' : '•'}</span>
                    <span>Au moins une minuscule</span>
                  </li>
                  <li className={`flex items-center space-x-2 ${criteria.number ? 'text-green-400' : 'text-blue-300'}`}>
                    <span>{criteria.number ? '✓' : '•'}</span>
                    <span>Au moins un chiffre</span>
                  </li>
                  <li className={`flex items-center space-x-2 ${criteria.special ? 'text-green-400' : 'text-blue-300'}`}>
                    <span>{criteria.special ? '✓' : '•'}</span>
                    <span>Au moins un caractère spécial</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Boutons */}
          <div className="flex space-x-3 pt-4">
            {!isFirstLogin && (
              <button
                type="button"
                onClick={onDismiss}
                className="flex-1 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                disabled={loading}
              >
                Plus tard
              </button>
            )}
            <button
              type="submit"
              className={`${isFirstLogin ? 'w-full' : 'flex-1'} px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 font-medium transition-colors disabled:opacity-50`}
              disabled={loading || newPasswordErrors.length > 0 || !passwordsMatch}
            >
              {loading ? 'Mise à jour...' : (isFirstLogin ? 'Créer le mot de passe' : 'Mettre à jour')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordChangeModal;
