const bcrypt = require('bcrypt');
const supabase = require('./src/config/supabase');
require('dotenv').config();

async function createUser() {
  const email = process.argv[2];
  const password = process.argv[3];
  const name = process.argv[4] || 'Admin';

  if (!email || !password) {
    console.log("Uso correto: node create-user.js <email> <senha> [nome]");
    console.log("Exemplo: node create-user.js admin@crm.com 123456 'João Silva'");
    process.exit(1);
  }

  // Gera o hash da senha
  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(password, salt);

  // Insere no Supabase
  const { data, error } = await supabase
    .from('crm_users')
    .insert([
      {
        email,
        password_hash,
        name,
        role: 'admin',
        active: true
      }
    ])
    .select();

  if (error) {
    console.error("❌ Erro ao criar usuário na tabela 'crm_users':\n", error.message);
    if (error.code === '42P01') {
      console.log("\n💡 Dica: A tabela 'crm_users' não existe no Supabase. Execute o comando SQL para criá-la primeiro.");
    }
  } else {
    console.log("✅ Usuário criado com sucesso!");
    console.dir(data);
  }
}

createUser();
