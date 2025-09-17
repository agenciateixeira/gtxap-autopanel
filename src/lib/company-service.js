// src/lib/company-service.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export const companyService = {
  // Obter empresa do usuário atual (NOVA FUNÇÃO)
  getCurrentUserCompany: async () => {
    try {
      // Obter usuário atual
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!user) throw new Error('Usuário não autenticado');

      // Buscar empresa do usuário
      const { data: userCompany, error: companyError } = await supabase
        .from('company_users')
        .select(`
          *,
          company:companies(*)
        `)
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();

      if (companyError) {
        // Se não encontrou, pode ser que o trigger não executou
        // Vamos tentar criar a empresa manualmente
        return await companyService.createCompanyForUser(user);
      }

      return {
        success: true,
        company: userCompany.company,
        userRole: userCompany.role,
        isOwner: userCompany.role === 'owner'
      };

    } catch (error) {
      console.error('Erro ao obter empresa do usuário:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Criar empresa para usuário (NOVA FUNÇÃO)
  createCompanyForUser: async (user) => {
    try {
      const userDomain = user.email.split('@')[1];
      
      // Verificar se já existe empresa com este domínio
      const { data: existingCompany, error: searchError } = await supabase
        .from('companies')
        .select('*')
        .eq('domain', userDomain)
        .single();

      let company;

      if (searchError && searchError.code === 'PGRST116') {
        // Empresa não existe, criar nova
        const companyName = userDomain.split('.')[0].charAt(0).toUpperCase() + 
                           userDomain.split('.')[0].slice(1) + ' Company';

        const { data: newCompany, error: createError } = await supabase
          .from('companies')
          .insert({
            name: companyName,
            domain: userDomain,
            plan: 'free',
            max_users: 10,
            owner_id: user.id,
            created_by: user.id
          })
          .select()
          .single();

        if (createError) throw createError;
        company = newCompany;

        // Adicionar usuário como owner
        const { error: userError } = await supabase
          .from('company_users')
          .insert({
            company_id: company.id,
            user_id: user.id,
            email: user.email,
            name: user.user_metadata?.full_name || user.email.split('@')[0],
            role: 'owner',
            status: 'active',
            invited_by: user.id
          });

        if (userError) throw userError;

      } else if (existingCompany) {
        // Empresa existe, verificar se usuário é o owner
        company = existingCompany;
        
        if (company.owner_id === user.id) {
          // É o owner, garantir que está na tabela company_users
          const { error: upsertError } = await supabase
            .from('company_users')
            .upsert({
              company_id: company.id,
              user_id: user.id,
              email: user.email,
              name: user.user_metadata?.full_name || user.email.split('@')[0],
              role: 'owner',
              status: 'active',
              invited_by: user.id
            }, { 
              onConflict: 'company_id,user_id'
            });

          if (upsertError) throw upsertError;
        } else {
          throw new Error('Uma empresa já existe para este domínio e você não é o proprietário');
        }
      }

      return {
        success: true,
        company,
        userRole: 'owner',
        isOwner: true
      };

    } catch (error) {
      console.error('Erro ao criar empresa:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Verificar se usuário é owner (NOVA FUNÇÃO)
  isUserOwner: async (userId, companyId) => {
    try {
      const { data: company, error } = await supabase
        .from('companies')
        .select('owner_id')
        .eq('id', companyId)
        .single();

      if (error) throw error;

      return company.owner_id === userId;

    } catch (error) {
      console.error('Erro ao verificar owner:', error);
      return false;
    }
  },

  // Validar se e-mail pertence ao domínio da empresa
  validateEmailDomain: async (email, companyId) => {
    try {
      const { data: company, error } = await supabase
        .from('companies')
        .select('domain')
        .eq('id', companyId)
        .single();

      if (error) throw error;

      const emailDomain = email.split('@')[1]?.toLowerCase();
      return emailDomain === company.domain.toLowerCase();
    } catch (error) {
      console.error('Erro ao validar domínio:', error);
      return false;
    }
  },

  // Enviar convite para usuário (ATUALIZADA)
  sendInvite: async (email, role, companyId, invitedBy) => {
    try {
      // Verificar se o usuário que está convidando tem permissão
      const isOwner = await companyService.isUserOwner(invitedBy, companyId);
      const hasPermission = await companyService.checkUserPermission(invitedBy, companyId, 'admin');

      if (!isOwner && !hasPermission) {
        throw new Error('Você não tem permissão para convidar usuários');
      }

      // Verificar se owner está tentando convidar outro owner
      if (role === 'owner') {
        throw new Error('Não é possível convidar outro proprietário. Cada empresa tem apenas um proprietário.');
      }

      // Validar domínio
      const isValidDomain = await companyService.validateEmailDomain(email, companyId);
      if (!isValidDomain) {
        throw new Error('E-mail não pertence ao domínio da empresa');
      }

      // Verificar se usuário já existe
      const { data: existingUser } = await supabase
        .from('company_users')
        .select('id')
        .eq('company_id', companyId)
        .eq('email', email.toLowerCase())
        .single();

      if (existingUser) {
        throw new Error('Usuário já faz parte da empresa');
      }

      // Verificar se já tem convite pendente
      const { data: existingInvite } = await supabase
        .from('user_invites')
        .select('id')
        .eq('company_id', companyId)
        .eq('email', email.toLowerCase())
        .eq('status', 'pending')
        .single();

      if (existingInvite) {
        throw new Error('Já existe um convite pendente para este e-mail');
      }

      // Criar convite
      const inviteToken = crypto.randomUUID();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7 dias para aceitar

      const { data: invite, error } = await supabase
        .from('user_invites')
        .insert({
          company_id: companyId,
          email: email.toLowerCase(),
          role,
          invited_by: invitedBy,
          invite_token: inviteToken,
          expires_at: expiresAt.toISOString(),
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      // TODO: Enviar e-mail de convite
      // await sendInviteEmail(email, inviteToken, companyName);

      return {
        success: true,
        invite,
        message: 'Convite enviado com sucesso'
      };

    } catch (error) {
      console.error('Erro ao enviar convite:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Listar usuários da empresa
  getCompanyUsers: async (companyId) => {
    try {
      const { data: users, error } = await supabase
        .from('company_users')
        .select(`
          *,
          invited_by_user:invited_by(email)
        `)
        .eq('company_id', companyId)
        .order('role', { ascending: false }) // Owner primeiro
        .order('created_at', { ascending: false });

      if (error) throw error;

      return {
        success: true,
        users
      };
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Listar convites pendentes
  getPendingInvites: async (companyId) => {
    try {
      const { data: invites, error } = await supabase
        .from('user_invites')
        .select(`
          *,
          invited_by_user:invited_by(email)
        `)
        .eq('company_id', companyId)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return {
        success: true,
        invites
      };
    } catch (error) {
      console.error('Erro ao buscar convites pendentes:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Alterar cargo de usuário (ATUALIZADA)
  updateUserRole: async (userId, newRole, companyId, requestingUserId) => {
    try {
      // Verificar se quem está fazendo a mudança tem permissão
      const isOwner = await companyService.isUserOwner(requestingUserId, companyId);
      
      if (!isOwner) {
        throw new Error('Apenas o proprietário pode alterar cargos');
      }

      // Não permitir alterar role do próprio owner
      if (userId === requestingUserId) {
        throw new Error('Você não pode alterar seu próprio cargo');
      }

      // Não permitir criar outro owner
      if (newRole === 'owner') {
        throw new Error('Não é possível promover usuário a proprietário');
      }

      // Verificar se não está tentando alterar outro owner
      const { data: targetUser, error: targetError } = await supabase
        .from('company_users')
        .select('role')
        .eq('user_id', userId)
        .eq('company_id', companyId)
        .single();

      if (targetError) throw targetError;

      if (targetUser.role === 'owner') {
        throw new Error('Não é possível alterar cargo do proprietário');
      }

      const { error } = await supabase
        .from('company_users')
        .update({ 
          role: newRole,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('company_id', companyId);

      if (error) throw error;

      return {
        success: true,
        message: 'Cargo alterado com sucesso'
      };

    } catch (error) {
      console.error('Erro ao alterar cargo:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Remover usuário da empresa (ATUALIZADA)
  removeUser: async (userId, companyId, requestingUserId) => {
    try {
      // Verificar se quem está removendo tem permissão
      const isOwner = await companyService.isUserOwner(requestingUserId, companyId);
      
      if (!isOwner) {
        throw new Error('Apenas o proprietário pode remover usuários');
      }

      // Não permitir remover a si mesmo
      if (userId === requestingUserId) {
        throw new Error('O proprietário não pode se remover da empresa');
      }

      // Verificar se não está tentando remover outro owner
      const { data: targetUser, error: targetError } = await supabase
        .from('company_users')
        .select('role')
        .eq('user_id', userId)
        .eq('company_id', companyId)
        .single();

      if (targetError) throw targetError;

      if (targetUser.role === 'owner') {
        throw new Error('Não é possível remover o proprietário');
      }

      const { error } = await supabase
        .from('company_users')
        .delete()
        .eq('user_id', userId)
        .eq('company_id', companyId);

      if (error) throw error;

      return {
        success: true,
        message: 'Usuário removido com sucesso'
      };

    } catch (error) {
      console.error('Erro ao remover usuário:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Verificar permissão do usuário (ATUALIZADA)
  checkUserPermission: async (userId, companyId, requiredRole = 'admin') => {
    try {
      const { data: user, error } = await supabase
        .from('company_users')
        .select('role')
        .eq('user_id', userId)
        .eq('company_id', companyId)
        .eq('status', 'active')
        .single();

      if (error) throw error;
      if (!user) return false;

      // Hierarquia: owner > admin > manager > user
      const roleHierarchy = {
        'owner': 4,
        'admin': 3,
        'manager': 2,
        'user': 1
      };

      const userLevel = roleHierarchy[user.role] || 0;
      const requiredLevel = roleHierarchy[requiredRole] || 0;

      return userLevel >= requiredLevel;

    } catch (error) {
      console.error('Erro ao verificar permissão:', error);
      return false;
    }
  },

  // Restante das funções originais...
  resendInvite: async (inviteId) => {
    try {
      const { data: invite, error: fetchError } = await supabase
        .from('user_invites')
        .select('*')
        .eq('id', inviteId)
        .eq('status', 'pending')
        .single();

      if (fetchError) throw fetchError;
      if (!invite) throw new Error('Convite não encontrado ou já foi processado');

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      if (new Date(invite.created_at) < thirtyDaysAgo) {
        throw new Error('Este convite é muito antigo para ser reenviado');
      }

      const newToken = crypto.randomUUID();
      const newExpiresAt = new Date();
      newExpiresAt.setDate(newExpiresAt.getDate() + 7);

      const { error: updateError } = await supabase
        .from('user_invites')
        .update({
          invite_token: newToken,
          expires_at: newExpiresAt.toISOString(),
          created_at: new Date().toISOString()
        })
        .eq('id', inviteId);

      if (updateError) throw updateError;

      return {
        success: true,
        message: 'Convite reenviado com sucesso'
      };

    } catch (error) {
      console.error('Erro ao reenviar convite:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  cancelInvite: async (inviteId) => {
    try {
      const { error } = await supabase
        .from('user_invites')
        .update({ status: 'cancelled' })
        .eq('id', inviteId)
        .eq('status', 'pending');

      if (error) throw error;

      return {
        success: true,
        message: 'Convite cancelado com sucesso'
      };

    } catch (error) {
      console.error('Erro ao cancelar convite:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
};