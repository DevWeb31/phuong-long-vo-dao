import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Eye, EyeOff, Shield, Lock, Mail, Swords, Home } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const schema = yup.object({
  email: yup
    .string()
    .max(100, 'Email trop long (max 100 caractères)')
    .email('Format email invalide')
    .required('Email requis'),
  password: yup
    .string()
    .min(8, 'Mot de passe trop court (min 8 caractères)')
    .max(50, 'Mot de passe trop long (max 50 caractères)')
    .required('Mot de passe requis'),
});

type FormData = yup.InferType<typeof schema>;

const AdminLogin: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [emailValidation, setEmailValidation] = useState<{
    isValid: boolean;
    message: string;
    charCount: number;
    isLimitReached: boolean;
  }>({ isValid: false, message: '', charCount: 0, isLimitReached: false });
  const [passwordValidation, setPasswordValidation] = useState<{
    isValid: boolean;
    message: string;
    charCount: number;
    isLimitReached: boolean;
  }>({ isValid: false, message: '', charCount: 0, isLimitReached: false });
  const { login } = useAdmin();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  // Fonction pour filtrer les caractères autorisés dans l'email
  const filterEmailInput = (value: string): string => {
    // Caractères autorisés : lettres (a-z, A-Z), chiffres (0-9), @, ., -, _
    return value.replace(/[^a-zA-Z0-9@._-]/g, '');
  };

  // Fonction de validation mot de passe en temps réel
  const validatePassword = (value: string) => {
    const charCount = value.length;
    
    if (charCount === 0) {
      setPasswordValidation({
        isValid: false,
        message: 'Mot de passe requis',
        charCount,
        isLimitReached: false
      });
    } else if (charCount === 50) {
      setPasswordValidation({
        isValid: true, // Limite atteinte n'est pas une erreur
        message: 'Limite de 50 caractères atteinte',
        charCount,
        isLimitReached: true
      });
    } else if (charCount < 8) {
      setPasswordValidation({
        isValid: false,
        message: 'Minimum 8 caractères requis',
        charCount,
        isLimitReached: false
      });
    } else {
      setPasswordValidation({
        isValid: true,
        message: 'Mot de passe valide',
        charCount,
        isLimitReached: false
      });
    }
    
    // Mettre à jour le formulaire
    setValue('password', value);
    trigger('password');
  };

  // Fonction de validation email en temps réel
  const validateEmail = (value: string) => {
    const charCount = value.length;
    
    // Validation format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidFormat = emailRegex.test(value);
    
    if (charCount === 0) {
      setEmailValidation({
        isValid: false,
        message: 'Email requis',
        charCount,
        isLimitReached: false
      });
    } else if (charCount === 100) {
      setEmailValidation({
        isValid: true, // Limite atteinte n'est pas une erreur
        message: 'Limite de 100 caractères atteinte',
        charCount,
        isLimitReached: true
      });
    } else if (!isValidFormat && charCount > 0) {
      setEmailValidation({
        isValid: false,
        message: 'Format email invalide',
        charCount,
        isLimitReached: false
      });
    } else if (isValidFormat) {
      setEmailValidation({
        isValid: true,
        message: 'Format email valide',
        charCount,
        isLimitReached: false
      });
    }
    
    // Mettre à jour le formulaire
    setValue('email', value);
    trigger('email');
  };

  // Gestionnaire de changement d'email avec filtrage
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const filteredValue = filterEmailInput(rawValue);
    
    setEmailValue(filteredValue);
    validateEmail(filteredValue);
  };

  // Gestionnaire de changement de mot de passe
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPasswordValue(value);
    validatePassword(value);
  };

  // Gestionnaire pour les événements de clavier (prévenir la saisie de caractères non autorisés)
  const handleEmailKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Touches de contrôle autorisées
    const allowedKeys = [
      'Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 
      'ArrowUp', 'ArrowDown', 'Home', 'End', 'Control', 'Meta', 'Alt',
      'Shift', 'CapsLock'
    ];
    
    // Autoriser toutes les touches de contrôle
    if (allowedKeys.includes(e.key) || e.ctrlKey || e.metaKey || e.altKey) {
      return;
    }
    
    // Caractères autorisés
    const allowedChars = /[a-zA-Z0-9@._-]/;
    
    // Bloquer seulement les caractères non autorisés
    if (!allowedChars.test(e.key)) {
      e.preventDefault();
    }
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const result = await login(data.email, data.password);
      if (result.success) {
        // Redirection automatique vers le dashboard
        navigate('/admin/dashboard');
      } else {
        toast.error(result.error || 'Email ou mot de passe incorrect');
      }
    } catch (error) {
      toast.error('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Fond arts martiaux avec motifs asiatiques */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-red-900 to-slate-800">
        {/* Motifs décoratifs */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 border-2 border-yellow-400 rounded-full transform rotate-12"></div>
          <div className="absolute top-32 right-16 w-24 h-24 border-2 border-red-400 rounded-full transform -rotate-12"></div>
          <div className="absolute bottom-20 left-20 w-28 h-28 border-2 border-yellow-400 rounded-full transform rotate-45"></div>
          <div className="absolute bottom-32 right-32 w-20 h-20 border-2 border-red-400 rounded-full transform -rotate-45"></div>
          
          {/* Lignes de force */}
          <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-20"></div>
          <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-400 to-transparent opacity-20"></div>
          <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-yellow-400 to-transparent opacity-20"></div>
          <div className="absolute top-0 left-3/4 w-px h-full bg-gradient-to-b from-transparent via-red-400 to-transparent opacity-20"></div>
        </div>
        
        {/* Particules flottantes */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-yellow-400 rounded-full animate-pulse opacity-60"></div>
          <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-red-400 rounded-full animate-pulse opacity-80"></div>
          <div className="absolute bottom-1/3 left-1/4 w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse opacity-70"></div>
          <div className="absolute bottom-1/4 right-1/3 w-1 h-1 bg-red-400 rounded-full animate-pulse opacity-60"></div>
        </div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        {/* Bouton retour au site */}
        <div className="absolute top-4 right-4 z-20">
          <a
            href="/"
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-lg transition-all duration-200 hover:scale-105 shadow-lg"
            title="Retourner au site principal"
          >
            <Home className="w-4 h-4" />
            <span>Retour au site</span>
          </a>
        </div>

        <div className="max-w-md w-full">
          {/* Logo et titre */}
          <div className="text-center mb-8">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl">
                <Swords className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -inset-2 bg-gradient-to-br from-yellow-400 to-red-500 rounded-full opacity-20 blur-lg"></div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2 tracking-wide">
              Administration
            </h1>
            <p className="text-yellow-200 text-lg font-medium">
              Phuong Long Vo Dao
            </p>
            <div className="mt-2 h-1 w-24 bg-gradient-to-r from-yellow-400 to-red-500 mx-auto rounded-full"></div>
          </div>

          {/* Formulaire de connexion avec transparence */}
          <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8">
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center space-x-3">
                <Shield className="w-6 h-6 text-yellow-400" />
                <h2 className="text-xl font-semibold text-white">
                  Connexion sécurisée
                </h2>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-2">
                  Adresse email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className={`h-5 w-5 transition-colors ${
                      emailValidation.isValid ? 'text-green-400' : 
                      emailValidation.charCount > 0 && !emailValidation.isValid ? 'text-red-400' : 
                      'text-yellow-400'
                    }`} />
                  </div>
                  <input
                    value={emailValue}
                    onChange={handleEmailChange}
                    onKeyDown={handleEmailKeyDown}
                    type="email"
                    maxLength={100}
                    className={`w-full pl-10 pr-4 py-3 bg-white/10 border rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                      emailValidation.isValid 
                        ? 'border-green-400 ring-2 ring-green-400' 
                        : emailValidation.charCount > 0 && !emailValidation.isValid
                          ? 'border-red-400 ring-2 ring-red-400'
                          : errors.email 
                            ? 'border-red-400 ring-2 ring-red-400'
                            : 'border-white/20 focus:ring-yellow-400'
                    }`}
                    placeholder="votre@email.com"
                    title="Caractères autorisés : a-z, A-Z, 0-9, @, ., -, _"
                  />
                </div>
                {/* Feedback en temps réel */}
                {emailValidation.charCount > 0 && (
                  <div className="mt-1 flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      emailValidation.isLimitReached ? 'bg-blue-400' : 
                      emailValidation.isValid ? 'bg-green-400' : 'bg-red-400'
                    }`}></div>
                    <p className={`text-xs ${
                      emailValidation.isLimitReached ? 'text-blue-300' : 
                      emailValidation.isValid ? 'text-green-300' : 'text-red-300'
                    }`}>
                      {emailValidation.message}
                    </p>
                  </div>
                )}
                {/* Message d'erreur du formulaire */}
                {errors.email && emailValidation.charCount === 0 && (
                  <p className="mt-1 text-sm text-red-300">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white/90 mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className={`h-5 w-5 transition-colors ${
                      passwordValidation.isValid ? 'text-green-400' : 
                      passwordValidation.charCount > 0 && !passwordValidation.isValid ? 'text-red-400' : 
                      'text-yellow-400'
                    }`} />
                  </div>
                  <input
                    value={passwordValue}
                    onChange={handlePasswordChange}
                    type={showPassword ? 'text' : 'password'}
                    maxLength={50}
                    className={`w-full pl-10 pr-12 py-3 bg-white/10 border rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                      passwordValidation.isValid 
                        ? 'border-green-400 ring-2 ring-green-400' 
                        : passwordValidation.charCount > 0 && !passwordValidation.isValid
                          ? 'border-red-400 ring-2 ring-red-400'
                          : errors.password 
                            ? 'border-red-400 ring-2 ring-red-400'
                            : 'border-white/20 focus:ring-yellow-400'
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-yellow-400 hover:text-white transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-yellow-400 hover:text-white transition-colors" />
                    )}
                  </button>
                </div>
                {/* Feedback en temps réel */}
                {passwordValidation.charCount > 0 && (
                  <div className="mt-1 flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      passwordValidation.isLimitReached ? 'bg-blue-400' : 
                      passwordValidation.isValid ? 'bg-green-400' : 'bg-red-400'
                    }`}></div>
                    <p className={`text-xs ${
                      passwordValidation.isLimitReached ? 'text-blue-300' : 
                      passwordValidation.isValid ? 'text-green-300' : 'text-red-300'
                    }`}>
                      {passwordValidation.message}
                    </p>
                  </div>
                )}
                {/* Message d'erreur du formulaire */}
                {errors.password && passwordValidation.charCount === 0 && (
                  <p className="mt-1 text-sm text-red-300">{errors.password.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-yellow-400 to-red-500 hover:from-yellow-500 hover:to-red-600 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Connexion...
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Lock className="w-4 h-4" />
                    <span>Se connecter</span>
                  </div>
                )}
              </button>
            </form>

          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="w-8 h-px bg-gradient-to-r from-transparent to-yellow-400"></div>
              <Swords className="w-4 h-4 text-yellow-400" />
              <div className="w-8 h-px bg-gradient-to-r from-yellow-400 to-transparent"></div>
            </div>
            <p className="text-white/70 text-sm">
              © {new Date().getFullYear()} Phuong Long Vo Dao - Administration
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;