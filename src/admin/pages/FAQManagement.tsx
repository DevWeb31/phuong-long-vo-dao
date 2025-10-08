import React, { useState, useEffect } from 'react';
import { 
  HelpCircle, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  AlertTriangle,
  Info,
  Filter,
  ArrowUp,
  ArrowDown,
  Download,
  Upload,
  TrendingUp,
  Calendar,
  Users,
  BarChart3,
  GripVertical,
  Lock,
  Filter as FilterIcon,
  FileText,
  UserCheck
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import toast from 'react-hot-toast';
import AdminTable from '../components/AdminTable';
import PlusActionsMenu from '../components/PlusActionsMenu';

const FAQManagement: React.FC = () => {
  const { faqs, clubs, users, addFAQ, updateFAQ, deleteFAQ, getAccessibleFAQs, canEditFAQ, user } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedClub, setSelectedClub] = useState('');
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedFAQ, setSelectedFAQ] = useState<any>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewFAQ, setPreviewFAQ] = useState<any>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [animatingRows, setAnimatingRows] = useState<Set<string>>(new Set());
  const [updatingOrders, setUpdatingOrders] = useState<Set<string>>(new Set());
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState<any>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newFAQId, setNewFAQId] = useState<string | null>(null);
  const [showToggleStatusModal, setShowToggleStatusModal] = useState(false);
  const [faqToToggle, setFaqToToggle] = useState<any>(null);

  const categories = ['general', 'enfants', 'equipement', 'inscription', 'tarifs', 'evenements'];


  // Utiliser les FAQ accessibles selon les permissions
  const accessibleFAQs = getAccessibleFAQs();
  
  const filteredFAQs = accessibleFAQs.filter(faq => {
    // Recherche par mots-clés (question et réponse)
    const searchWords = searchTerm.toLowerCase().split(' ').filter(word => word.length > 0);
    const matchesSearch = searchWords.length === 0 || searchWords.every(word =>
      faq.question.toLowerCase().includes(word) ||
      faq.answer.toLowerCase().includes(word) ||
      faq.category.toLowerCase().includes(word)
    );

    // Filtres
    const matchesCategory = !selectedCategory || faq.category === selectedCategory;
    const matchesClub = !selectedClub || faq.club_id === selectedClub;

    return matchesSearch && matchesCategory && matchesClub;
  }).sort((a, b) => a.order_index - b.order_index);

  const getCategoryLabel = (category: string) => {
    const labels = {
      general: 'Général',
      enfants: 'Enfants',
      equipement: 'Équipement',
      inscription: 'Inscription',
      tarifs: 'Tarifs',
      evenements: 'Événements'
    };
    return labels[category as keyof typeof labels] || category;
  };

  const handleDeleteFAQ = (id: string) => {
    const faq = accessibleFAQs.find(f => f.id === id);
    if (!faq) {
      toast.error('FAQ non trouvée');
      return;
    }

    // Vérifier les permissions avant d'ouvrir la modal
    const canEdit = canEditFAQ(id);
    if (!canEdit) {
      toast.error('Vous n\'avez pas les droits pour supprimer cette FAQ');
      return;
    }

    // Ouvrir la modal de confirmation
    setFaqToDelete(faq);
    setShowDeleteModal(true);
  };

  const confirmDeleteFAQ = async () => {
    if (!faqToDelete) {
      return;
    }

    try {
      await deleteFAQ(faqToDelete.id);
      toast.success('FAQ supprimée avec succès');
      setShowDeleteModal(false);
      setFaqToDelete(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la suppression');
    }
  };

  const handleFAQStatusChoice = async (isActive: boolean) => {
    if (!newFAQId) {
      return;
    }

    try {
      await updateFAQ(newFAQId, { is_active: isActive });
      toast.success(`FAQ ${isActive ? 'activée' : 'désactivée'} avec succès`);
      setShowStatusModal(false);
      setNewFAQId(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la mise à jour du statut');
    }
  };

  const handleReorder = async (id: string, direction: 'up' | 'down') => {
    // Vérifier qu'on peut réorganiser
    if (!canReorder) {
      toast.error('La réorganisation n\'est pas disponible');
      return;
    }

    const faq = accessibleFAQs.find(f => f.id === id);
    if (!faq) return;

    // Vérifier les permissions
    if (!canEditFAQ(id)) {
      toast.error('Vous n\'avez pas les droits pour réorganiser cette FAQ');
      return;
    }

    // Utiliser filteredFAQs pour avoir l'ordre d'affichage actuel
    const faqsInDisplayOrder = filteredFAQs;

    const currentIndex = faqsInDisplayOrder.findIndex(f => f.id === id);
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    if (newIndex < 0 || newIndex >= faqsInDisplayOrder.length) return;

    const targetFAQ = faqsInDisplayOrder[newIndex];
    if (!targetFAQ) return;

    // Vérifier les permissions pour la FAQ cible
    if (!canEditFAQ(targetFAQ.id)) {
      toast.error('Vous n\'avez pas les droits pour réorganiser ces FAQ');
      return;
    }

    // Animation simple
    setAnimatingRows(new Set([id, targetFAQ.id]));
    setUpdatingOrders(new Set([id, targetFAQ.id]));
    
    try {
      // Créer le nouvel ordre basé sur la position souhaitée
      const newOrder = [...faqsInDisplayOrder];
      
      // Échanger les éléments dans le tableau
      [newOrder[currentIndex], newOrder[newIndex]] = [newOrder[newIndex], newOrder[currentIndex]];
      
      // Sauvegarder le nouvel ordre en base
      const updatePromises = newOrder.map((faq, index) => {
        const newOrderIndex = index + 1;
        if (faq.order_index !== newOrderIndex) {
          return updateFAQ(faq.id, { order_index: newOrderIndex });
        }
        return Promise.resolve();
      });

      await Promise.all(updatePromises);
      toast.success('Ordre modifié');
    } catch (error) {
      console.error('Erreur lors de la réorganisation:', error);
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la modification');
    } finally {
      // Fin de l'animation simple
      setTimeout(() => {
        setAnimatingRows(new Set());
        setUpdatingOrders(new Set());
      }, 300);
    }
  };


  const handlePreviewFAQ = (faq: any) => {
    setPreviewFAQ(faq);
    setShowPreviewModal(true);
  };

  const handleToggleStatusClick = (faq: any) => {
    if (!canEditFAQ(faq.id)) {
      toast.error('Vous n\'avez pas les droits pour modifier cette FAQ');
      return;
    }
    setFaqToToggle(faq);
    setShowToggleStatusModal(true);
  };

  const handleToggleStatusConfirm = async (newStatus: boolean) => {
    if (!faqToToggle) return;

    try {
      await updateFAQ(faqToToggle.id, { is_active: newStatus });
      toast.success(newStatus ? 'FAQ activée' : 'FAQ désactivée');
      setShowToggleStatusModal(false);
      setFaqToToggle(null);
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
      toast.error('Erreur lors du changement de statut');
    }
  };








  const getFAQStats = () => {
    const accessibleFAQs = getAccessibleFAQs();
    const totalFAQs = accessibleFAQs.length;
    const activeFAQs = accessibleFAQs.filter(f => f.is_active).length;
    const inactiveFAQs = totalFAQs - activeFAQs;
    const generalFAQs = accessibleFAQs.filter(f => !f.club_id).length;
    const clubFAQs = accessibleFAQs.filter(f => f.club_id).length;
    
    // Statistiques par catégorie
    const categoryStats = categories.map(category => ({
      category,
      count: accessibleFAQs.filter(f => f.category === category).length,
      active: accessibleFAQs.filter(f => f.category === category && f.is_active).length
    }));

    // FAQ récentes (dernières 30 jours)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentFAQs = accessibleFAQs.filter(f => new Date(f.created_at) >= thirtyDaysAgo).length;

    // FAQ les plus longues
    const longestFAQ = accessibleFAQs.reduce((longest, current) => 
      current.answer.length > longest.answer.length ? current : longest, 
      { answer: '', question: '' }
    );

    return {
      total: totalFAQs,
      active: activeFAQs,
      inactive: inactiveFAQs,
      general: generalFAQs,
      club: clubFAQs,
      recent: recentFAQs,
      categoryStats,
      longestFAQ
    };
  };


  const handleExportFAQs = (format: 'csv' | 'json') => {
    const faqsToExport = faqs;

    if (faqsToExport.length === 0) {
      toast.error('Aucune FAQ à exporter');
      return;
    }

    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `faqs-${timestamp}.${format}`;

    if (format === 'json') {
      const dataStr = JSON.stringify(faqsToExport, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = filename;
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } else {
      // Export CSV
      const headers = ['question', 'answer', 'category', 'order_index', 'is_active', 'created_at'];
      const csvContent = [
        headers.join(','),
        ...faqsToExport.map(faq => 
          headers.map(header => {
            const value = faq[header];
            return typeof value === 'string' && value.includes(',') 
              ? `"${value.replace(/"/g, '""')}"` 
              : value;
          }).join(',')
        )
      ].join('\n');

      const dataUri = 'data:text/csv;charset=utf-8,'+ encodeURIComponent(csvContent);
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', filename);
      linkElement.click();
    }

    toast.success(`${faqsToExport.length} FAQ(s) exportée(s) en ${format.toUpperCase()}`);
  };

  const handleImportFAQs = async (file: File) => {
    try {
      const text = await file.text();
      let importedFAQs: any[] = [];

      if (file.name.endsWith('.json')) {
        importedFAQs = JSON.parse(text);
      } else if (file.name.endsWith('.csv')) {
        const lines = text.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        
        importedFAQs = lines.slice(1).map(line => {
          const values = line.split(',').map(v => v.trim());
          const faq: any = {};
          headers.forEach((header, index) => {
            let value = values[index] || '';
            if (value.startsWith('"') && value.endsWith('"')) {
              value = value.slice(1, -1).replace(/""/g, '"');
            }
            if (header === 'is_active') {
              faq[header] = value === 'true' || value === '1';
            } else if (header === 'order_index') {
              faq[header] = parseInt(value) || 1;
            } else {
              faq[header] = value;
            }
          });
          return faq;
        });
      } else {
        throw new Error('Format de fichier non supporté');
      }

      // Valider et importer les FAQ
      let successCount = 0;
      for (const faq of importedFAQs) {
        if (faq.question && faq.answer && faq.category) {
          const faqToImport = {
            question: faq.question,
            answer: faq.answer,
            category: faq.category,
            // L'ordre sera calculé automatiquement dans addFAQ
            is_active: faq.is_active !== undefined ? faq.is_active : true
          };
          
          await addFAQ(faqToImport);
          successCount++;
        }
      }

      toast.success(`${successCount} FAQ(s) importée(s) avec succès`);
      setShowImportModal(false);
    } catch (error) {
      console.error('Erreur lors de l\'import:', error);
      toast.error('Erreur lors de l\'import du fichier');
    }
  };


  // Synchroniser automatiquement les ordres au chargement pour s'assurer qu'ils correspondent à la position
  useEffect(() => {
    // Synchronisation automatique des ordres au chargement
  }, [accessibleFAQs]);

  // Fermer les filtres mobiles en cliquant en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showMobileFilters) {
        const target = event.target as Element;
        const filtersPanel = target.closest('.mobile-filters-panel');
        const filtersButton = target.closest('[data-filters-button]');
        
        if (!filtersPanel && !filtersButton) {
          setShowMobileFilters(false);
        }
      }
    };

    if (showMobileFilters) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMobileFilters]);

  // Déterminer si on peut réorganiser (possible seulement quand une catégorie spécifique est sélectionnée)
  const canReorder = selectedCategory !== '';

  return (
    <div className="space-y-6">
      {/* En-tête: bouton + à gauche | séparateur | cartes info à droite */}
      <div className="flex items-stretch justify-between">
        <div className="flex items-stretch">
          <PlusActionsMenu
            buttonTitle="Actions FAQ"
            buttonClassName="h-12"
            actions={[
              { label: 'Importer', onClick: () => setShowImportModal(true) },
              { label: 'Exporter en CSV', onClick: () => handleExportFAQs('csv') },
              { label: 'Exporter en JSON', onClick: () => handleExportFAQs('json') },
              { label: 'Ajouter une FAQ', onClick: () => setShowCreateModal(true) },
            ]}
          />
          <div className="self-center h-6 w-px bg-white/20 mx-4" />
        </div>
        <div className="flex-1 flex items-stretch space-x-3">
          <div className="flex-1 bg-white/5 rounded-lg h-12 px-3 text-center flex flex-col items-center justify-center">
            <p className="text-lg font-bold text-white leading-none">{getFAQStats().total}</p>
            <p className="text-xs text-white/60 mt-0.5">Total</p>
          </div>
          <div className="flex-1 bg-white/5 rounded-lg h-12 px-3 text-center flex flex-col items-center justify-center">
            <p className="text-lg font-bold text-green-400 leading-none">{getFAQStats().active}</p>
            <p className="text-xs text-white/60 mt-0.5">Actives</p>
          </div>
          <div className="flex-1 bg-white/5 rounded-lg h-12 px-3 text-center flex flex-col items-center justify-center">
            <p className="text-lg font-bold text-red-400 leading-none">{getFAQStats().inactive}</p>
            <p className="text-xs text-white/60 mt-0.5">Inactives</p>
          </div>
        </div>
      </div>

      {/* Compteur déplacé dans footer + Filtres via modal */}



                
      {/* FAQ Table - Desktop */}
      <div className="hidden lg:block">
        <AdminTable
          headers={[
            'Question',
            '',
            'Catégorie',
            'Club',
            <span key="statut" className="text-center block">Statut</span>,
            ...(canReorder ? [<span key="ordre" className="text-center block">Ordre</span>] : []),
            <span key="actions" className="text-right block">Actions</span>
          ]}
        filtersContent={(
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Club</label>
              <select
                value={selectedClub}
                onChange={(e) => setSelectedClub(e.target.value)}
                className="admin-input w-full"
              >
                <option value="">Global</option>
                {clubs.map(club => (
                  <option key={club.id} value={club.id}>{club.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Catégorie</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="admin-input w-full"
              >
                <option value="">Toutes les catégories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{getCategoryLabel(cat)}</option>
                ))}
              </select>
            </div>
          </div>
        )}
        footerLeft={(
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher par mots-clés..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="admin-input pl-10 h-9 w-64"
              />
            </div>
            <div className="h-6 w-px bg-white/20"></div>
            <span className="text-sm text-white/70">{filteredFAQs.length} {filteredFAQs.length <= 1 ? 'résultat trouvé' : 'résultats trouvés'}</span>
            <>
              <div className="h-6 w-px bg-white/20"></div>
              <div className="flex items-center gap-2 text-xs text-white/60">
                <span className="px-2 py-1 bg-white/10 rounded border border-white/20">
                  Club: {selectedClub ? (clubs.find(c => c.id === selectedClub)?.name || selectedClub) : 'Global'}
                </span>
                <span className="px-2 py-1 bg-white/10 rounded border border-white/20">
                  Catégorie: {selectedCategory ? getCategoryLabel(selectedCategory) : 'Toutes les catégories'}
                </span>
              </div>
            </>
          </div>
        )}
        bodyHeightClass="h-[calc(100vh-223px)]"
        wrapperMaxHeightClass="max-h-[calc(100vh-183px)]"
      >
        {filteredFAQs.map((faq, index) => (
                <tr 
                  key={faq.id} 
                  className={`faq-table-row cursor-pointer hover:bg-gray-800/30 transition-colors ${
                    animatingRows.has(faq.id) 
                      ? 'reordering' 
                      : ''
                  }`}
                  onClick={() => handlePreviewFAQ(faq)}
                  title="Cliquer pour voir l'aperçu de la FAQ"
                >
                  
                  {/* Question */}
                  <td>
                    <div className="flex items-start">
              <div className="flex-1">
                        <div className="text-sm font-medium text-white mb-1">
                          {faq.question.length > 40 ? `${faq.question.substring(0, 40)}...` : faq.question}
        </div>
                        <div className="text-sm text-white/70 line-clamp-2">
                  {faq.answer.length > 40 ? `${faq.answer.substring(0, 40)}...` : faq.answer}
      </div>
                      </div>
                    </div>
                  </td>
                  
                  {/* Info */}
                  <td className="text-center">
                    <div className="relative group flex justify-center items-center">
                      <Info className="w-4 h-4 text-blue-400 hover:text-blue-300 cursor-help" />
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10 border border-white/20">
                        Créé le {new Date(faq.created_at).toLocaleDateString('fr-FR')} à {new Date(faq.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} par {faq.created_by ? (() => {
                          // Trouver l'utilisateur qui a créé la FAQ
                          const creator = users?.find(u => u.id === faq.created_by);
                          return creator ? creator.name : 'Utilisateur inconnu';
                        })() : 'Système'}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                      </div>
                    </div>
                  </td>
                  
                  {/* Catégorie */}
                  <td>
                    <span className="admin-badge bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    {getCategoryLabel(faq.category)}
                  </span>
                  </td>
                  
                  {/* Club */}
                  <td>
                    {faq.club_id ? (
                      <span className="admin-badge bg-green-500/20 text-green-300 border border-green-500/30">
                        {clubs.find(c => c.id === faq.club_id)?.name || 'Club inconnu'}
                    </span>
                    ) : (
                      <span className="admin-badge bg-gray-500/20 text-gray-300 border border-gray-500/30">
                        Global
                  </span>
                    )}
                  </td>
                  
                  {/* Statut */}
                  <td className="text-center">
                    <div className="relative group flex justify-center items-center">
                      <div className={`w-3 h-3 rounded-full ${
                        faq.is_active ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10 border border-white/20">
                        {faq.is_active ? 'FAQ active' : 'FAQ inactive'}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                      </div>
                    </div>
                  </td>
                  
                  {/* Ordre */}
                {canReorder && (
                    <td className="text-center">
                      <div className="faq-order-controls flex justify-center">
                        {canEditFAQ(faq.id) ? (
                          <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReorder(faq.id, 'up');
                    }}
                    disabled={index === 0}
                              className={`faq-order-button ${index === 0 ? 'text-white/30 cursor-not-allowed' : 'text-white/60 hover:text-white'}`}
                              title="Déplacer vers le haut"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                            <span className={`faq-order-number text-sm font-medium text-white min-w-[2rem] text-center ${
                              updatingOrders.has(faq.id) ? 'updating' : ''
                            }`}>
                              {index + 1}
                            </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReorder(faq.id, 'down');
                    }}
                    disabled={index === filteredFAQs.length - 1}
                              className={`faq-order-button ${index === filteredFAQs.length - 1 ? 'text-white/30 cursor-not-allowed' : 'text-white/60 hover:text-white'}`}
                              title="Déplacer vers le bas"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                          </>
                        ) : (
                          <div className="flex items-center justify-center space-x-2">
                            <Lock className="w-4 h-4 text-yellow-400" />
                            <span className="text-sm font-medium text-white">
                              {faq.order_index}
                            </span>
                </div>
                        )}
                      </div>
                    </td>
                  )}
                  
                  {/* Actions */}
                  <td className="text-right">
                <div className="flex items-center justify-end space-x-2">
                      {canEditFAQ(faq.id) ? (
                        <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFAQ(faq);
                      setShowCreateModal(true);
                    }}
                            className="faq-action-button text-green-400 hover:text-green-300"
                    title="Modifier"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleStatusClick(faq);
                    }}
                    className="faq-action-button text-blue-400 hover:text-blue-300"
                    title="Modifier le statut"
                  >
                    <UserCheck className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteFAQ(faq.id);
                    }}
                            className="faq-action-button text-red-400 hover:text-red-300"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                        </>
                      ) : (
                        <div className="flex items-center space-x-1 text-yellow-600">
                          <Lock className="w-4 h-4" />
                          <span className="text-xs">Lecture seule</span>
                </div>
                      )}
              </div>
                  </td>
                </tr>
        ))}
        </AdminTable>
      </div>

      {/* FAQ Cards - Mobile/Tablet */}
      <div className="lg:hidden space-y-4">
        {/* Compact Search bar with overlay filters */}
        <div className="relative">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/80 w-4 h-4 z-10" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="admin-input pl-10 w-full h-10"
              />
            </div>
            <button
              onClick={() => setShowMobileFilters(v => !v)}
              className={`px-3 h-10 text-sm font-medium rounded-lg border transition-colors ${showMobileFilters ? 'bg-yellow-500 text-gray-900 border-yellow-400' : 'bg-white/10 text-white border-white/20'}`}
              title="Filtres"
              data-filters-button
            >
              Filtres
            </button>
          </div>
          
          {/* Info discrète sous le champ de recherche */}
          <div className="flex items-center justify-between mt-2 px-1">
            <span className="text-xs text-white/50">
              {filteredFAQs.length} {filteredFAQs.length <= 1 ? 'résultat' : 'résultats'}
            </span>
            <div className="flex items-center gap-2 text-xs text-white/40">
              <span className="px-1.5 py-0.5 bg-white/5 rounded text-white/60">
                {selectedClub ? (clubs.find(c => c.id === selectedClub)?.name || 'Club') : 'Global'}
              </span>
              <span className="px-1.5 py-0.5 bg-white/5 rounded text-white/60">
                {selectedCategory ? getCategoryLabel(selectedCategory) : 'Toutes les catégories'}
              </span>
            </div>
          </div>

          {showMobileFilters && (
            <div className="mobile-filters-panel absolute left-0 right-0 top-full mt-2 admin-card p-4 space-y-3 z-50">
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Club</label>
                <select
                  value={selectedClub}
                  onChange={(e) => setSelectedClub(e.target.value)}
                  className="admin-input w-full h-11"
                >
                  <option value="">Global</option>
                  {clubs.map(club => (
                    <option key={club.id} value={club.id}>{club.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Catégorie</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="admin-input w-full h-11"
                >
                  <option value="">Toutes les catégories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{getCategoryLabel(cat)}</option>
                  ))}
                </select>
              </div>
            </div>
            {/* Compteur retiré sur mobile dans la zone de filtres */}
            </div>
          )}
        </div>

        {/* FAQ Cards */}
        <div className={`space-y-3 max-h-[calc(100vh-220px)] overflow-y-auto admin-table-container pb-6`}>
          {filteredFAQs.map((faq, index) => (
            <div
              key={faq.id}
              className="admin-card p-4 cursor-pointer hover:bg-white/5 transition-all"
              onClick={() => handlePreviewFAQ(faq)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-medium mb-1 text-sm line-clamp-1 break-words">
                    {faq.question}
                  </h3>
                  <p className="text-white/70 text-xs line-clamp-2 break-words">
                    {faq.answer}
                  </p>
                </div>
                <div className={`w-3 h-3 rounded-full flex-shrink-0 ml-3 mt-1 ${faq.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
              </div>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {canReorder && (
                  <span className="admin-badge bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs">
                    #{index + 1}
                  </span>
                )}
                <span className="admin-badge bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs">
                  {getCategoryLabel(faq.category)}
                </span>
                {faq.club_id ? (
                  <span className="admin-badge bg-green-500/20 text-green-300 border border-green-500/30 text-xs">
                    {clubs.find(c => c.id === faq.club_id)?.name || 'Club'}
                  </span>
                ) : (
                  <span className="admin-badge bg-gray-500/20 text-gray-300 border border-gray-500/30 text-xs">
                    Global
                  </span>
                )}
              </div>

              {canEditFAQ(faq.id) && (
                <div className="flex items-center justify-end space-x-2 pt-3 border-t border-white/10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFAQ(faq);
                      setShowCreateModal(true);
                    }}
                    className="text-green-400 hover:text-green-300 p-2"
                    title="Modifier"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleStatusClick(faq);
                    }}
                    className="p-2 text-blue-400 hover:text-blue-300"
                    title="Modifier le statut"
                  >
                    <UserCheck className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteFAQ(faq.id);
                    }}
                    className="text-red-400 hover:text-red-300 p-2"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

        {/* Message si aucune FAQ */}
      {filteredFAQs.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-white/60 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">
            Aucune FAQ trouvée
          </h3>
            <p className="text-white/70">
              Essayez de modifier vos filtres ou créez une nouvelle FAQ.
            </p>
        </div>
      )}
      

      {/* Create/Edit FAQ Modal */}
      {showCreateModal && (
        <FAQModal
          faq={selectedFAQ}
          clubs={clubs}
          categories={categories}
          onClose={() => {
            setShowCreateModal(false);
            setSelectedFAQ(null);
          }}
          onSave={async (faqData) => {
            try {
              if (selectedFAQ) {
                // Modification : pas de boîte de dialogue
                await updateFAQ(selectedFAQ.id, faqData);
                toast.success('FAQ modifiée avec succès');
                setShowCreateModal(false);
                setSelectedFAQ(null);
              } else {
                // Création : créer avec statut temporaire puis afficher la boîte de dialogue
                const faqDataWithTempStatus = {
                  ...faqData,
                  is_active: false  // Créer temporairement inactive
                };
                
                const newFAQId = await addFAQ(faqDataWithTempStatus);
                console.log('🔍 DEBUG - FAQ créée avec ID:', newFAQId);
                if (newFAQId) {
                  console.log('🔍 DEBUG - Affichage de la modal de statut');
                  setNewFAQId(newFAQId);
                  setShowStatusModal(true);
                  setShowCreateModal(false);
                } else {
                  console.log('🔍 DEBUG - Pas d\'ID retourné, fermeture de la modal');
                  toast.success('FAQ créée avec succès');
                  setShowCreateModal(false);
                }
              }
            } catch (error) {
              toast.error('Erreur lors de la sauvegarde');
            }
          }}
        />
      )}

      {/* Preview Modal */}
      {showPreviewModal && previewFAQ && (
        <FAQPreviewModal
          faq={previewFAQ}
          onClose={() => {
            setShowPreviewModal(false);
            setPreviewFAQ(null);
          }}
        />
      )}


      {/* Import Modal */}
      {showImportModal && (
        <FAQImportModal
          onClose={() => setShowImportModal(false)}
          onImport={handleImportFAQs}
        />
      )}

      {/* Delete Confirmation Modal - placé au niveau racine du composant */}
      {showDeleteModal && faqToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
          <div className="bg-gray-900 border border-white/20 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Confirmer la suppression</h3>
                <p className="text-white/60 text-sm">Cette action est irréversible</p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-white mb-2">
                Êtes-vous sûr de vouloir supprimer cette FAQ ?
              </p>
              <div className="bg-gray-800/50 rounded-lg p-3 border border-white/10">
                <p className="text-white font-medium text-sm">{faqToDelete.question}</p>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setFaqToDelete(null);
                }}
                className="flex-1 px-4 py-2 text-white/70 hover:text-white border border-white/20 rounded-lg hover:border-white/30 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={confirmDeleteFAQ}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Status Modal */}
      {showToggleStatusModal && faqToToggle && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
          <div className="bg-gray-900 border border-white/20 rounded-lg p-6 max-w-lg w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <UserCheck className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Modifier le statut</h3>
                <p className="text-white/60 text-sm">Choisissez le nouveau statut de la FAQ</p>
              </div>
            </div>

            <div className="mb-6">
              <div className="bg-gray-800/50 rounded-lg p-3 border border-white/10 mb-4">
                <p className="text-white font-medium text-sm line-clamp-2">{faqToToggle.question}</p>
                <p className="text-white/40 text-xs mt-1">
                  Statut actuel : {faqToToggle.is_active ? 'Active' : 'Inactive'}
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => handleToggleStatusConfirm(true)}
                  disabled={faqToToggle.is_active}
                  className={`w-full flex items-center space-x-3 p-4 rounded-lg border transition-colors ${
                    faqToToggle.is_active
                      ? 'bg-green-500/20 border-green-500/50 cursor-not-allowed opacity-60'
                      : 'bg-green-500/10 border-green-500/30 hover:bg-green-500/20 hover:border-green-500/50'
                  }`}
                >
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <div className="text-left flex-1">
                    <div className="text-green-300 font-medium">Active</div>
                    <div className="text-green-400/70 text-sm">La FAQ sera visible publiquement</div>
                  </div>
                  {faqToToggle.is_active && (
                    <div className="text-green-400 text-xs">(Actuel)</div>
                  )}
                </button>

                <button
                  onClick={() => handleToggleStatusConfirm(false)}
                  disabled={!faqToToggle.is_active}
                  className={`w-full flex items-center space-x-3 p-4 rounded-lg border transition-colors ${
                    !faqToToggle.is_active
                      ? 'bg-red-500/20 border-red-500/50 cursor-not-allowed opacity-60'
                      : 'bg-red-500/10 border-red-500/30 hover:bg-red-500/20 hover:border-red-500/50'
                  }`}
                >
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <div className="text-left flex-1">
                    <div className="text-red-300 font-medium">Inactive</div>
                    <div className="text-red-400/70 text-sm">La FAQ ne sera plus visible publiquement</div>
                  </div>
                  {!faqToToggle.is_active && (
                    <div className="text-red-400 text-xs">(Actuel)</div>
                  )}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => {
                  setShowToggleStatusModal(false);
                  setFaqToToggle(null);
                }}
                className="px-4 py-2 text-white/70 hover:text-white border border-white/20 rounded-lg hover:border-white/30 transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Confirmation Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
          <div className="bg-gray-900 border border-white/20 rounded-lg p-6 max-w-lg w-full mx-4">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <HelpCircle className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Statut de la FAQ</h3>
                <p className="text-white/60 text-sm">Votre FAQ a été créée avec succès !</p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-white mb-4 text-center">
                Voulez-vous que cette FAQ soit <strong>visible sur le site</strong> ?
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={() => handleFAQStatusChoice(true)}
                  className="w-full flex items-center space-x-3 p-4 bg-green-500/10 border border-green-500/30 rounded-lg hover:bg-green-500/20 transition-colors group"
                >
                  <div className="w-4 h-4 bg-green-500 rounded-full group-hover:scale-110 transition-transform"></div>
                  <div className="text-left">
                    <div className="text-green-300 font-medium">Oui, rendre la FAQ active</div>
                    <div className="text-green-400/70 text-sm">Visible sur le site pour tous les utilisateurs</div>
                  </div>
                </button>
                
                <button
                  onClick={() => handleFAQStatusChoice(false)}
                  className="w-full flex items-center space-x-3 p-4 bg-gray-500/10 border border-gray-500/30 rounded-lg hover:bg-gray-500/20 transition-colors group"
                >
                  <div className="w-4 h-4 bg-gray-500 rounded-full group-hover:scale-110 transition-transform"></div>
                  <div className="text-left">
                    <div className="text-gray-300 font-medium">Non, garder la FAQ inactive</div>
                    <div className="text-gray-400/70 text-sm">Non visible sur le site (peut être activée plus tard)</div>
                  </div>
                </button>
              </div>
            </div>

            <div className="text-center">
              <p className="text-white/50 text-xs">
                Vous pourrez toujours modifier le statut depuis la liste des FAQ
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// FAQ Modal Component
const FAQModal: React.FC<{
  faq: any;
  clubs: any[];
  categories: string[];
  onClose: () => void;
  onSave: (data: any) => void;
}> = ({ faq, clubs, categories, onClose, onSave }) => {
  const { user } = useAdmin();
  const [formData, setFormData] = useState(faq ? {
    ...faq,
    clubId: faq.club_id || '',  // Mapper club_id vers clubId pour le formulaire
    is_active: faq.is_active  // Garder le statut existant pour les modifications
  } : {
    question: '',
    answer: '',
    category: 'general',
    clubId: '',
    is_active: null  // Statut temporaire pour les nouvelles FAQ
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getCategoryLabel = (category: string) => {
    const labels = {
      general: 'Général',
      practice: 'Pratique',
      equipment: 'Équipement',
      registration: 'Inscription',
      events: 'Événements'
    };
    return labels[category as keyof typeof labels] || category;
  };

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    // Validation de la question
    if (!formData.question.trim()) {
      newErrors.question = 'La question est obligatoire';
    } else if (formData.question.trim().length < 10) {
      newErrors.question = 'La question doit contenir au moins 10 caractères';
    } else if (formData.question.trim().length > 150) {
      newErrors.question = 'La question ne peut pas dépasser 150 caractères';
    }

    // Validation de la réponse
    if (!formData.answer.trim()) {
      newErrors.answer = 'La réponse est obligatoire';
    } else if (formData.answer.trim().length < 30) {
      newErrors.answer = 'La réponse doit contenir au moins 30 caractères';
    } else if (formData.answer.trim().length > 800) {
      newErrors.answer = 'La réponse ne peut pas dépasser 800 caractères';
    }

    // Validation de la catégorie
    if (!formData.category) {
      newErrors.category = 'La catégorie est obligatoire';
    }


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Veuillez corriger les erreurs dans le formulaire');
      return;
    }

    setIsSubmitting(true);
    try {
      // Mapper les données pour correspondre à l'interface attendue
      const faqData = {
        ...formData,
        club_id: formData.clubId || null  // Mapper clubId vers club_id
        // order_index sera calculé automatiquement dans addFAQ/updateFAQ
      };
      await onSave(faqData);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast.error('Erreur lors de la sauvegarde de la FAQ');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Effacer l'erreur pour ce champ
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">
            {faq ? 'Modifier la FAQ' : 'Créer une FAQ'}
          </h3>
          <button onClick={onClose} className="text-white/60 hover:text-white">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">
              Question *
            </label>
            <input
              type="text"
              required
              maxLength={150}
              value={formData.question}
              onChange={(e) => handleInputChange('question', e.target.value)}
              className={`admin-input ${errors.question ? 'border-red-500' : ''}`}
              placeholder="Quelle est votre question ?"
            />
            {errors.question && (
              <p className="text-red-400 text-sm mt-1">{errors.question}</p>
            )}
            <p className="text-white/60 text-xs mt-1">
              {formData.question.length}/150 caractères
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">
              Réponse *
            </label>
            <textarea
              required
              maxLength={800}
              value={formData.answer}
              onChange={(e) => handleInputChange('answer', e.target.value)}
              rows={6}
              className={`admin-input ${errors.answer ? 'border-red-500' : ''}`}
              placeholder="Réponse détaillée à la question..."
            />
            {errors.answer && (
              <p className="text-red-400 text-sm mt-1">{errors.answer}</p>
            )}
            <p className="text-white/60 text-xs mt-1">
              {formData.answer.length}/800 caractères
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">
                Catégorie *
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className={`admin-input w-full ${errors.category ? 'border-red-500' : ''}`}
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {getCategoryLabel(category)}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-400 text-sm mt-1">{errors.category}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">
                Club (optionnel)
              </label>
              <select
                value={formData.clubId}
                onChange={(e) => handleInputChange('clubId', e.target.value)}
                className="admin-input w-full"
                disabled={user?.role !== 'superadmin' && !formData.clubId}
              >
                <option value="">Global</option>
                {user?.role === 'superadmin' ? (
                  // Les superadmin peuvent créer des FAQ pour tous les clubs
                  clubs.map(club => (
                  <option key={club.id} value={club.id}>{club.name}</option>
                  ))
                ) : (
                  // Les autres utilisateurs ne peuvent créer que pour leurs clubs
                  clubs.filter(club => user?.clubAccess.includes(club.id)).map(club => (
                    <option key={club.id} value={club.id}>{club.name}</option>
                  ))
                )}
              </select>
              {user?.role !== 'superadmin' && (
                <p className="text-blue-400 text-xs mt-1">
                  Vous ne pouvez créer des FAQ que pour vos clubs assignés
                </p>
              )}
            </div>
          </div>


          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="admin-button-secondary"
              disabled={isSubmitting}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="admin-button-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sauvegarde...' : (faq ? 'Modifier' : 'Créer')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// FAQ Preview Modal Component
const FAQPreviewModal: React.FC<{
  faq: any;
  onClose: () => void;
}> = ({ faq, onClose }) => {
  const getCategoryLabel = (category: string) => {
    const labels = {
      general: 'Général',
      practice: 'Pratique',
      equipment: 'Équipement',
      registration: 'Inscription',
      events: 'Événements'
    };
    return labels[category as keyof typeof labels] || category;
  };

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">
            Aperçu de la FAQ
          </h3>
          <button onClick={onClose} className="text-white/60 hover:text-white">
            ×
          </button>
        </div>

        <div className="space-y-6">
          {/* Header de la FAQ */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="admin-badge bg-blue-100 text-blue-800">
                {getCategoryLabel(faq.category)}
              </span>
              <span className="admin-badge bg-gray-100 text-gray-800">
                Ordre: {faq.order_index}
              </span>
              <span className={`admin-badge ${faq.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {faq.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>

          {/* Contenu de la FAQ - Style front-end */}
          <div className="bg-white rounded-lg p-6 shadow-lg max-h-[55vh] overflow-y-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 break-words">
              {faq.question}
            </h2>
            <div className="prose prose-gray max-w-none break-words">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
                {faq.answer}
              </p>
            </div>
          </div>

          {/* Métadonnées */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h4 className="text-sm font-medium text-white mb-3">Informations</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-white/60">Créée le:</span>
                <span className="text-white ml-2">
                  {new Date(faq.created_at).toLocaleDateString('fr-FR')}
                </span>
              </div>
              <div>
                <span className="text-white/60">Modifiée le:</span>
                <span className="text-white ml-2">
                  {new Date(faq.updated_at).toLocaleDateString('fr-FR')}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-6">
          <button
            onClick={onClose}
            className="admin-button-primary"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

// FAQ Import Modal Component
const FAQImportModal: React.FC<{
  onClose: () => void;
  onImport: (file: File) => void;
}> = ({ onClose, onImport }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileSelect = (file: File) => {
    if (file.name.endsWith('.csv') || file.name.endsWith('.json')) {
      setSelectedFile(file);
    } else {
      toast.error('Seuls les fichiers CSV et JSON sont supportés');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleSubmit = () => {
    if (selectedFile) {
      onImport(selectedFile);
    }
  };

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">
            Importer des FAQ
          </h3>
          <button onClick={onClose} className="text-white/60 hover:text-white">
            ×
          </button>
        </div>

        <div className="space-y-6">
          {/* Instructions */}
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
            <h4 className="text-white font-medium mb-2">Instructions d'import</h4>
            <ul className="text-white/70 text-sm space-y-1">
              <li>• Formats supportés : CSV et JSON</li>
              <li>• Colonnes requises : question, answer, category</li>
              <li>• Colonnes optionnelles : order_index, is_active</li>
              <li>• Les FAQ existantes ne seront pas dupliquées</li>
            </ul>
          </div>

          {/* Zone de dépôt */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragOver 
                ? 'border-blue-400 bg-blue-900/20' 
                : 'border-white/20 hover:border-white/40'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            {selectedFile ? (
              <div className="space-y-3">
                <div className="text-green-400">
                  <Upload className="w-12 h-12 mx-auto mb-2" />
                </div>
                <p className="text-white font-medium">{selectedFile.name}</p>
                <p className="text-white/60 text-sm">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  Supprimer
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <Upload className="w-12 h-12 mx-auto text-white/60" />
                <div>
                  <p className="text-white font-medium">
                    Glissez-déposez votre fichier ici
                  </p>
                  <p className="text-white/60 text-sm">
                    ou cliquez pour sélectionner
                  </p>
                </div>
                <input
                  type="file"
                  accept=".csv,.json"
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="admin-button-secondary cursor-pointer"
                >
                  Choisir un fichier
                </label>
              </div>
            )}
          </div>

          {/* Exemple de format */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h4 className="text-white font-medium mb-3">Exemple de format CSV</h4>
            <pre className="text-white/70 text-xs overflow-x-auto">
{`question,answer,category,order_index,is_active
"Quels sont les horaires ?","Les cours ont lieu du lundi au vendredi","general",1,true
"Comment s'inscrire ?","Vous pouvez vous inscrire directement au club","registration",2,true`}
            </pre>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-6">
          <button
            onClick={onClose}
            className="admin-button-secondary"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedFile}
            className="admin-button-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Importer
          </button>
        </div>
      </div>

      

    </div>
  );
};

export default FAQManagement;