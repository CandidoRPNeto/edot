class ApiRequest {

    constructor(baseUrl = 'http://localhost:8000/api') {
        this.baseUrl = baseUrl;
    }

    async request(endpoint, method = 'GET', data = null, need_token = true) {
        const url = `${this.baseUrl}/${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };

        if (need_token) {
            const token = localStorage.getItem('token');
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        }
        const options = {
            method,
            headers,
            credentials: 'include'
        };

        if (data && (method === 'POST' || method === 'PUT')) {
            options.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(url, options);
            if (response.status >= 400) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro na requisição');
            }

            return await response.json();
        } catch (error) {
            console.error('Erro na requisição:', error);
            throw error;
        }
    }
}

class ApiAdapter {

    constructor() {
        this.apiRequest = new ApiRequest();
    }

    async login(email, password) {
        return this.apiRequest.request('auth/login', 'POST', { email, password }, false);
    }

    async logout() {
        return this.apiRequest.request('auth/logout', 'POST');
    }


    async listarTurmasOptions($name) {
        return this.apiRequest.request(`classroom/option?search=${$name}`);
    }

    async listarAlunosOptions($name) {
        return this.apiRequest.request(`student/option?search=${$name}`);
    }

    async getDashInfo() {
        return this.apiRequest.request(`dashboard/quantity`);
    }

    async listarTurmas(params) {
        let url = `classroom/index?page=${params.page}`;

        if (params.search) {
            url = `classroom/find?page=${params.page}&search=${encodeURIComponent(params.search)}`;
        }

        return this.apiRequest.request(url);
    }

    async cadastrarTurma(dadosTurma) {
        return this.apiRequest.request('classroom/create', 'POST', dadosTurma);
    }

    async obterTurma(id) {
        return this.apiRequest.request(`classroom/find/${id}`);
    }

    async atualizarTurma(id, dadosTurma) {
        return this.apiRequest.request(`classroom/update/${id}`, 'PUT', dadosTurma);
    }

    async removerTurma(id) {
        return this.apiRequest.request(`classroom/delete/${id}`, 'DELETE');
    }


    async matricularAluno(idAluno, idTurma) {
        return this.apiRequest.request('enrollment/create', 'POST', {
            student_id: idAluno,
            classroom_id: idTurma
        });
    }

    async listarMatriculas(params) {
        let url = `enrollment/index?page=${params.page}`;

        if (params.search && params.filter) {
            url = `enrollment/find?page=${params.page}&search=${encodeURIComponent(params.search)}&filter=${encodeURIComponent(params.filter)}`;
        }

        return this.apiRequest.request(url);
    }

    async cancelarMatricula(idMatricula) {
        return this.apiRequest.request(`enrollment/delete/${idMatricula}`, 'DELETE');
    }

    async listarAlunos(pagina = 1, termoBusca = '') {
        let endpoint;
        if (termoBusca !== '') {
            endpoint = `student/find?page=${pagina}&search=${termoBusca}&filter=`;
        }
        else {
            endpoint = `student/index?page=${pagina}`;
        }
        return this.apiRequest.request(endpoint);
    }

    async obterAluno(id) {
        return this.apiRequest.request(`student/find/${id}`);
    }

    async cadastrarAluno(dadosAluno) {
        return this.apiRequest.request('student/create', 'POST', dadosAluno);
    }

    async atualizarAluno(id, dadosAluno) {
        return this.apiRequest.request(`student/update/${id}`, 'PUT', dadosAluno);
    }

    async removerAluno(id) {
        return this.apiRequest.request(`student/delete/${id}`, 'DELETE');
    }


}

const api = new ApiAdapter();