// src/app/api/contato/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('Dados recebidos:', body);
    
    // Validação básica
    if (!body.nome || !body.email || !body.empresa) {
      console.log('Validação falhou:', { nome: body.nome, email: body.email, empresa: body.empresa });
      return NextResponse.json(
        { error: 'Campos obrigatórios: nome, email e empresa' },
        { status: 400 }
      );
    }

    console.log('Tentando inserir na tabela companies...');

    // Primeiro, vamos testar se conseguimos fazer uma query simples
    const { data: testData, error: testError } = await supabase
      .from('companies')
      .select('*')
      .limit(1);

    if (testError) {
      console.error('Erro ao fazer SELECT:', testError);
      return NextResponse.json(
        { 
          error: 'Erro de conexão com banco',
          details: testError.message,
          code: testError.code 
        },
        { status: 500 }
      );
    }

    console.log('SELECT funcionou, dados de teste:', testData);

    // Agora tenta o INSERT
    const insertData = {
      nome: body.nome,
      domínio: body.email,
      plano: body.solucao || 'Contato via site'
    };

    console.log('Dados para inserir:', insertData);

    const { data, error } = await supabase
      .from('companies')
      .insert([insertData])
      .select();

    if (error) {
      console.error('Erro ao inserir:', error);
      return NextResponse.json(
        { 
          error: 'Erro ao salvar dados',
          details: error.message,
          code: error.code,
          hint: error.hint 
        },
        { status: 500 }
      );
    }

    console.log('Inserção bem-sucedida:', data);

    return NextResponse.json(
      { 
        message: 'Contato registrado com sucesso',
        data: data[0]
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Erro geral na API:', error);
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Opcional: Endpoint para listar contatos (apenas para admin)
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: 'Erro ao buscar dados' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Erro na API:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}