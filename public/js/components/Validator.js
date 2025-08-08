const Validator = {
    tamanhoMinimo(valor, tamanhoMinimo = 3) {
        return valor && valor.trim().length >= tamanhoMinimo;
    },

    campoPreenchido(valor) {
        if (valor === null || valor === undefined) return false;
        if (typeof valor === 'string') return valor.trim() !== '';
        return true;
    },

    formatoCpf(cpf) {
        const regex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/;
        return regex.test(cpf);
    },

    formatoEmail(email) {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(email);
    },

    senhaForte(senha) {
        if (senha.length < 8) return false;

        if (!/[A-Z]/.test(senha)) return false;

        if (!/[a-z]/.test(senha)) return false;

        if (!/[0-9]/.test(senha)) return false;

        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(senha)) return false;

        return true;
    },

    validarFormulario(dados, regras) {
        const erros = {};

        Object.keys(regras).forEach(campo => {
            const validacoes = regras[campo];
            
            validacoes.forEach(validacao => {
                const { tipo, mensagem, parametros = [] } = validacao;
                
                if (typeof this[tipo] !== 'function') {
                    console.error(`Método de validação '${tipo}' não existe.`);
                    return;
                }
                
                const valido = this[tipo](dados[campo], ...parametros);
                
                if (!valido) {
                    if (!erros[campo]) {
                        erros[campo] = [];
                    }
                    erros[campo].push(mensagem);
                }
            });
        });

        return {
            valido: Object.keys(erros).length === 0,
            erros
        };
    }
};