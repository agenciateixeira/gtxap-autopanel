// app/api/conversations/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const status = searchParams.get('status') || 'all'

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID é obrigatório' },
        { status: 400 }
      )
    }

    let query = supabaseAdmin
      .from('chat_conversations')
      .select(`
        id,
        conversation_id,
        status,
        last_message,
        last_message_at,
        closed_at,
        created_at,
        updated_at
      `)
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })

    if (status !== 'all') {
      query = query.eq('status', status)
    }

    const { data: conversations, error } = await query

    if (error) throw error

    // Buscar estatísticas de mensagens para cada conversa
    const conversationsWithStats = await Promise.all(
      (conversations || []).map(async (conv) => {
        const { data: messageStats, error: statsError } = await supabaseAdmin
          .from('chat_messages')
          .select('id', { count: 'exact' })
          .eq('conversation_id', conv.conversation_id)

        if (statsError) {
          console.warn('Erro ao buscar stats de mensagens:', statsError)
        }

        return {
          ...conv,
          message_count: messageStats?.length || 0
        }
      })
    )

    return NextResponse.json({
      conversations: conversationsWithStats,
      total: conversations?.length || 0
    })

  } catch (error) {
    console.error('Erro ao buscar conversas:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, action, conversationId } = await request.json()

    if (!userId || !action) {
      return NextResponse.json(
        { error: 'User ID e action são obrigatórios' },
        { status: 400 }
      )
    }

    switch (action) {
      case 'close_all_active':
        // Encerrar todas as conversas ativas do usuário
        const { error: closeError } = await supabaseAdmin
          .from('chat_conversations')
          .update({
            status: 'closed',
            closed_by: userId,
            closed_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)
          .eq('status', 'active')

        if (closeError) throw closeError

        return NextResponse.json({
          message: 'Todas as conversas ativas foram encerradas'
        })

      case 'archive_conversation':
        if (!conversationId) {
          return NextResponse.json(
            { error: 'Conversation ID é obrigatório para arquivar' },
            { status: 400 }
          )
        }

        const { error: archiveError } = await supabaseAdmin
          .from('chat_conversations')
          .update({
            status: 'archived',
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)
          .eq('conversation_id', conversationId)

        if (archiveError) throw archiveError

        return NextResponse.json({
          message: 'Conversa arquivada com sucesso'
        })

      case 'delete_conversation':
        if (!conversationId) {
          return NextResponse.json(
            { error: 'Conversation ID é obrigatório para deletar' },
            { status: 400 }
          )
        }

        // Deletar mensagens da conversa
        await supabaseAdmin
          .from('chat_messages')
          .delete()
          .eq('user_id', userId)
          .eq('conversation_id', conversationId)

        // Deletar a conversa
        const { error: deleteError } = await supabaseAdmin
          .from('chat_conversations')
          .delete()
          .eq('user_id', userId)
          .eq('conversation_id', conversationId)

        if (deleteError) throw deleteError

        return NextResponse.json({
          message: 'Conversa deletada com sucesso'
        })

      default:
        return NextResponse.json(
          { error: 'Ação inválida' },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('Erro ao gerenciar conversa:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}