// Autenticar utilizador
function login() {
  (async () => {
    const { value: formValues } = await Swal.fire({
      title: "Área de utilizador (Y)AMDB",
      html:
        '<input id="email" type="email" class="swal2-input" placeholder="e-mail">' +
        '<input id="pwd" type="password" class="swal2-input" placeholder="senha">',
      showCancelButton: true,
      confirmButtonText: "Entrar",
      cancelButtonText: "Cancelar",
      showLoaderOnConfirm: true,
      allowOutsideClick: true,
      allowEnterKey: true,
      focusConfirm: true,
      footer:
        '<p>Não tem conta? <button id="btnRegisto" onclick="registoUtilizador()" class="btn btn-outline-success">' +
        "Registe-se</button></p>",
      preConfirm: () => {
        return [
          document.getElementById("email").value,
          document.getElementById("pwd").value,
        ]
      }
    })

    if (formValues) {
      const loginReq = async () => {
        try {
            const res = await axios({
              method: 'POST',
              url: "/api/users/login",
              data: {
                email: formValues[0],
                password: formValues[1]
              }
            })
            if (res.data.data.user.role === 'admin') {
              window.location.replace("/admin");


            }
            if (res.data.status === 'success') {
              Swal.fire({
                icon: "success",
                title: "Login efectuado!",
                showConfirmButton: false,
                timer: 1500,
              })
              window.setTimeout(() => {
                location.assign('/')
              }, 1500)
            }
          } catch (err) {
            Swal.fire({
              icon: 'error',
              title: 'Erro',
              text: err.response.data.message,
            })
        }
      }
      loginReq()
    }
  })()
}

function changePassword() {
  (async () => {
    const { value: formValues } = await Swal.fire({
      title: "Alterar a sua senha",
      html:
        '<input id="senhaActual" type="password" class="swal2-input" placeholder="Senha actual">' +
        '<input id="novaSenha" type="password" class="swal2-input" placeholder="Nova senha">' +
        '<input id="confirmNovaSenha" type="password" class="swal2-input" placeholder="Confirmar nova senha">',
      showCancelButton: true,
      confirmButtonText: "Alterar",
      cancelButtonText: "Cancelar",
      showLoaderOnConfirm: true,
      allowOutsideClick: false,
      allowEnterKey: true,
      focusConfirm: true,
      preConfirm: () => {
        return [
          document.getElementById("senhaActual").value,
          document.getElementById("novaSenha").value,
          document.getElementById("confirmNovaSenha").value,
        ]
      }
    })

    if (formValues) {
      const changePwReq = async () => {
        try {
            const res = await axios({
              method: 'PATCH',
              url: "/api/users/updatePassword/",
              data: {
                passwordCurrent: formValues[0],
                password: formValues[1],
                password_confirm: formValues[2]
              }
            })
            if (res.data.status === 'success') {
              Swal.fire({
                icon: "success",
                title: "Senha alterada.",
                showConfirmButton: false,
                timer: 1500,
              })
            }
          } catch (err) {
            Swal.fire({
              icon: 'error',
              title: 'Erro',
              text: err.response.data.message,
            })
        }
      }
      changePwReq()
    }
  })()
}



// Registar utilizador
//https://stackoverflow.com/questions/47942149/sweetalert2-example-reports-await-is-only-valid-in-async-functions-and-async-ge
function registoUtilizador() {
  (async () => {
    const { value: formValues } = await Swal.fire({
      title: "Bem-vindo à (Y)AMDB",
      html:
        '<input id="nome" type="text" class="swal2-input" placeholder="Nome">' +
        '<input id="email" type="email" class="swal2-input" placeholder="Endereço de email">' +
        '<input id="password" type="password" class="swal2-input" placeholder="Senha">' +
        '<input id="confirmPassword" type="password" class="swal2-input" placeholder="Confirmar senha">',
      showCancelButton: true,
      confirmButtonText: "Registar",
      cancelButtonText: "Cancelar",
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return [
          document.getElementById("nome").value,
          document.getElementById("email").value,
          document.getElementById("password").value,
          document.getElementById("confirmPassword").value,
        ];
      },
    });

    if (formValues) {
      const signup = async () => {
        try {
            const res = await axios({
              method: 'POST',
              url: "/api/users/signup/",
              data: {
                name: formValues[0],
                email: formValues[1],
                password: formValues[2],
                password_confirm: formValues[3]
              }
            })
            if (res.data.status === 'success') {
              Swal.fire({
                icon: 'success',
                title: 'Registado com sucesso.',
                text: 'Foi enviado um email de confirmação.',
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowOutsideClick: false,
              }).then(function() {
                location.reload()
              })
            }
          } catch (err) {
            Swal.fire({
              icon: 'error',
              title: 'Erro',
              text: err.response.data.message,
            })
        }
      }
      signup()
    }
  })();
}

function logout() {
  Swal.fire({
    title: "Tem a certeza?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sair",
    cancelButtonText: "Não",
    cancelButtonColor: "#d33",
    confirmButtonColor: "#3085d6",
    reverseButtons: true,
  }).then((result) => {
    if (result.isConfirmed) {
      const logoutReq = async () => {
        try {
          const res = await axios({
            method: 'GET',
            url:'/api/users/logout'
          })
          if (res.data.status = 'success') {
            window.setTimeout(() => {
              location.assign('/')
            }, 1500)
            Swal.fire({
              icon: "success",
              title: "Sessão terminada",
              showConfirmButton: false,
              timer: 1500
            })
          }
        } catch (err) {
          Swal.fire({
            icon: 'error',
            text: 'Ocoreu um erro.',
            showConfirmButton: false,
            timer: 1500
          });
        }
      }
      logoutReq()
    }
  })
}

function addMovie() {
  (async () => {
    const { value: formValues } = await Swal.fire({
      title: "Adicionar filme",
      html:
        '<input id="title" class="swal2-input" placeholder="Título" maxlength="100" required>' +
        '<input id="org_title" class="swal2-input" placeholder="Título original" maxlength="100">' +
        '<input id="year" type="number" class="swal2-input" placeholder="Ano de lançamento" min="1880" max="2200" required>' +
        '<input id="duration" type="number" class="swal2-input" placeholder="Duração em minutos" max="2000" required>' +
        '<textarea id="overview" class="swal2-input" placeholder="Sinopse" maxlength="1500" rows="4"></textarea>' +
        '<input id="imdb_rating" type="number" min="0" max="10" step="0.1" class="swal2-input" placeholder="Avaliação IMDb">' +
        '<input id="img_url" class="swal2-input" placeholder="URL do Poster" maxlength="500">',
      showCancelButton: true,
      confirmButtonText: "Registar",
      cancelButtonText: "Cancelar",
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return [
          document.getElementById("title").value,
          document.getElementById("org_title").value,
          document.getElementById("year").value,
          document.getElementById("duration").value,
          document.getElementById("overview").value,
          document.getElementById("imdb_rating").value,
          document.getElementById("img_url").value,
        ];
      },
    });
    if (formValues) {
      const addMovieReq = async () => {
        try {
            const res = await axios({
              method: 'POST',
              url: "/api/movies",
              data: {
                title: formValues[0],
                org_title: formValues[1],
                duration: formValues[3],
                year: formValues[2],
                overview: formValues[4],
                imdb_rating: formValues[5],
                img_url: formValues[6],
              }
            })
            if (res.data.status === 'success') {
              Swal.fire({
                icon: 'success',
                title: 'Filme adicionado com successo',
                text: res.data.data.movie.title,
                imageUrl: res.data.data.movie.img_url,
                imageWidth: 200,
                imageHeight: 300,
                showConfirmButton: false,
                timer: 2500
              })
              window.setTimeout(() => {
                location.reload()
              }, 2000)
            }
          } catch (err) {
            Swal.fire({
              icon: 'error',
              title: 'Erro ao adicionar filme',
              text: err.response.data.message,
            })
        }
      }
      addMovieReq()
    }
  })();
}

function updateMovie(id, title, orgTitle, year, duration, overview, imdb, imgUrl) {
  (async () => {
    const { value: formValues } = await Swal.fire({
      title: "Alterar filme",
      html:
        '<input id="title" class="swal2-input" placeholder="Título" maxlength="100" value="'+ title +'" required>' +
        '<input id="org_title" class="swal2-input" placeholder="Título original" maxlength="100" value="'+ orgTitle +'">' +
        '<input id="year" type="number" class="swal2-input" placeholder="Ano de lançamento" min="1880" max="2200" value="'+ year +'" required>' +
        '<input id="duration" type="number" class="swal2-input" placeholder="Duração em minutos" max="2000" value="'+ duration +'" required>' +
        '<textarea id="overview" class="swal2-input" placeholder="Sinopse" maxlength="1500" rows="4">' + overview + '</textarea>' +
        '<input id="imdb_rating" type="number" min="0" max="10" step="0.1" class="swal2-input" placeholder="Avaliação IMDb" value="'+ imdb +'">' +
        '<input id="img_url" class="swal2-input" placeholder="URL do Poster" maxlength="500" value="'+ imgUrl +'">',
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return [
          document.getElementById("title").value,
          document.getElementById("org_title").value,
          document.getElementById("year").value,
          document.getElementById("duration").value,
          document.getElementById("overview").value,
          document.getElementById("imdb_rating").value,
          document.getElementById("img_url").value,
        ];
      },
    });
    if (formValues) {
      const updateMovieReq = async () => {
        try {
            const res = await axios({
              method: 'PATCH',
              url: '/api/movies/' + id,
              data: {
                title: formValues[0],
                org_title: formValues[1],
                duration: formValues[3],
                year: formValues[2],
                overview: formValues[4],
                imdb_rating: formValues[5],
                img_url: formValues[6],
              }
            })
            if (res.data.status === 'success') {
              Swal.fire({
                icon: 'success',
                title: 'Filme alterado com successo',
                text: res.data.data.movie.title,
                imageUrl: res.data.data.movie.img_url,
                imageWidth: 200,
                imageHeight: 300,
                showConfirmButton: false,
                timer: 1500
              })
              window.setTimeout(() => {
                location.reload()
              }, 1500)
            }
          } catch (err) {
            Swal.fire({
              icon: 'error',
              title: 'Erro ao alterar filme',
              text: err.response.data.message,
            })
        }
      }
      updateMovieReq()
    }
  })();
}



function addUser() {
  (async () => {
    const { value: formValues } = await Swal.fire({
      title: "Adicionar Utilizador",
      html:
        '<input id="name" class="swal2-input" placeholder="Nome" maxlength="100" required>' +
        '<input id="email" type="email" class="swal2-input" placeholder="Endereço de email" maxlength="350" required>' +
        '<label for="role">Tipo de utilizador: </label>' +
        '<select class="swal2-input" name="role" id="role">' +
        '<option value="user">Utilizador</option>' +
        '<option value="admin">Administrador</option>' +
        '</select>' +
        '<input id="password" type="password" class="swal2-input" placeholder="Senha" minlength="8" maxlength="64" required>' +
        '<input id="password_confirm" type="password" class="swal2-input" placeholder="Confirmação de senha" minlength="8" maxlength="64" required>',
      showCancelButton: true,
      confirmButtonText: "Registar",
      cancelButtonText: "Cancelar",
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return [
          document.getElementById('name').value,
          document.getElementById('email').value,
          document.getElementById('role').value,
          document.getElementById('password').value,
          document.getElementById('password_confirm').value,
        ];
      },
    });
    if (formValues) {
      const addUserReq = async () => {
        try {
            const res = await axios({
              method: 'POST',
              url: "/api/users",
              data: {
                name: formValues[0],
                email: formValues[1],
                role: formValues[2],
                password: formValues[3],
                password_confirm: formValues[4]
              }
            })
            if (res.data.status === 'success') {
              Swal.fire({
                icon: 'success',
                title: 'Utilizador registado com sucesso',
                text: res.data.data.user.name,
                showConfirmButton: false,
                timer: 1500
              })
              window.setTimeout(() => {
                location.reload()
              }, 1500)
            }
          } catch (err) {
            Swal.fire({
              icon: 'error',
              title: 'Erro ao registar utilizador',
              text: err.response.data.message,
            })
        }
      }
      addUserReq()
    }
  })();
}

function chkRole(role) {
  if (role == 'admin') {
    return '<option value="user">Utilizador</option><option value="admin" selected>Administrador</option>'
  } else {
    return '<option value="user" selected>Utilizador</option><option value="admin">Administrador</option>'
  }
}

function updateUser(id, name, email, role) {
  (async () => {
    const { value: formValues } = await Swal.fire({
      title: "Alterar dados de " + name.split(' ')[0],
      html:
        '<input id="name" class="swal2-input" placeholder="Nome" maxlength="100" value="' + name + '" required>' +
        '<input id="email" type="email" class="swal2-input" placeholder="Endereço de email" maxlength="350" value="' + email +'" required>' +
        '<label for="role">Tipo de utilizador: </label>' +
        '<select class="swal2-input" name="role" id="role">' + chkRole(role) + '</select>',
      showCancelButton: true,
      confirmButtonText: "Alterar",
      cancelButtonText: "Cancelar",
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return [
          document.getElementById('name').value,
          document.getElementById('email').value,
          document.getElementById('role').value,
        ];
      },
    });
    if (formValues) {
      const updateUserReq = async () => {
        try {
            const res = await axios({
              method: 'PATCH',
              url: '/api/users/' + id,
              data: {
                name: formValues[0],
                email: formValues[1],
                role: formValues[2],
              }
            })
            if (res.data.status === 'success') {
              Swal.fire({
                icon: 'success',
                title: 'Utilizador alterado com sucesso',
                text: res.data.data.user.name,
                showConfirmButton: false,
                timer: 1500
              })
              window.setTimeout(() => {
                location.reload()
              }, 1500)
            }
          } catch (err) {
            Swal.fire({
              icon: 'error',
              title: 'Erro ao alterar utilizador',
              text: err.response.data.message,
            })
        }
      }
      updateUserReq()
    }
  })();
}


function deleteMovie(movie) {
  Swal.fire({
    title: "Tem a certeza que deseja eliminar?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Eliminar",
    cancelButtonText: "Não",
    cancelButtonColor: "#d33",
    confirmButtonColor: "#3085d6",
    reverseButtons: true,
  }).then((result) => {
    if (result.isConfirmed) {
      const delMovieReq = async () => {
        try {
          const res = await axios({
            method: 'DELETE',
            url:'/api/movies/' + movie
          })
          if (res.data.status = 'success') {
            Swal.fire({
              icon: "success",
              title: "Filme eliminado",
              showConfirmButton: false,
              timer: 1500
            })
            window.setTimeout(() => {
              location.reload()
            }, 1500)
          }
        } catch (err) {
          Swal.fire({
            icon: 'error',
            text: 'Ocoreu um erro.',
            showConfirmButton: false,
            timer: 1500
          });
        }
      }
      delMovieReq()
    }
  })
}

function deleteUser(user) {
  Swal.fire({
    title: "Tem a certeza que deseja eliminar?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Eliminar",
    cancelButtonText: "Não",
    cancelButtonColor: "#d33",
    confirmButtonColor: "#3085d6",
    reverseButtons: true,
  }).then((result) => {
    if (result.isConfirmed) {
      const delUserReq = async () => {
        try {
          const res = await axios({
            method: 'DELETE',
            url:'/api/users/' + user
          })

          if (res.data.status = 'success') {
            Swal.fire({
              icon: "success",
              title: "Utilizador eliminado",
              showConfirmButton: false,
              timer: 1500
            })
            window.setTimeout(() => {
              location.reload()
            }, 1500)
          }
        } catch (err) {
          Swal.fire({
            icon: 'error',
            text: 'Ocoreu um erro.',
            showConfirmButton: false,
            timer: 1500
          });
        }
      }
      delUserReq()
    }
  })
}


//Modal dos filmes em destaque
function modalMovie(id, title, orgTitle, year, duration, overview, imdb, imgUrl) {
  console.log(title)
  Swal.fire({
    title: title,
    html: '<h5 class="d-inline">Título original: </h5><p class="d-inline">' + orgTitle + '</p><br>' +
          '<h5 class="d-inline">Ano de lançamento: </h5><p class="d-inline">' + year + '</p><br>' +
          '<h5 class="d-inline">Duração: </h5><p class="d-inline">' + duration + ' minutos</p><br>' +
          '<h5 class="d-inline">Avaliação IMDb: </h5><p class="d-inline">' + imdb +
          '<h5 class="text-left">Sinopse: </h5><p class="text-justify">' + overview,

    imageUrl: imgUrl,
    imageWidth: 300,
    imageHeight: 400,
    imageAlt: title + " - Poster",
  });
}

$(".heart.far").click(function () {
  $(this).toggleClass("far fa");
});
