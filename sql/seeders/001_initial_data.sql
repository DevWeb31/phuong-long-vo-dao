-- Seeder 001: Données initiales
-- Date: 2024-12-19
-- Description: Insertion des données de base pour l'application

-- Données initiales pour les clubs
INSERT INTO public.clubs (name, city, department, member_count) VALUES
('Club Montaigut sur Save', 'Montaigut sur Save', '31', 45),
('Club Trégeux', 'Trégeux', '22', 32)
ON CONFLICT DO NOTHING;

-- Données initiales pour les FAQ
INSERT INTO public.faq (question, answer, category, order_index) VALUES
('Quels sont les horaires des cours ?', 'Les cours ont lieu du lundi au vendredi de 18h à 20h.', 'general', 1),
('Comment s''inscrire ?', 'Vous pouvez vous inscrire directement au club ou nous contacter par téléphone.', 'inscription', 2),
('Quel équipement faut-il ?', 'Un kimono blanc et une ceinture blanche pour débuter.', 'equipement', 3),
('Quels sont les tarifs ?', 'Les tarifs varient selon l''âge et le type d''abonnement. Contactez-nous pour plus d''informations.', 'tarifs', 4),
('Y a-t-il des cours pour les enfants ?', 'Oui, nous proposons des cours adaptés pour tous les âges à partir de 5 ans.', 'enfants', 5)
ON CONFLICT DO NOTHING;

-- Données initiales pour les utilisateurs admin (à personnaliser)
INSERT INTO public.users (email, name, role) VALUES
('admin@phuonglongvodao.fr', 'Administrateur Principal', 'superadmin'),
('club@phuonglongvodao.fr', 'Gestionnaire Club', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Message de confirmation
SELECT 'Données initiales insérées avec succès !' as message;
